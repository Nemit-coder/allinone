import Post from "../models/post.model";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { PostType } from "../types/post.type";

// ─── existing controllers (unchanged) ─────────────────────────────────────────

const uploadPost = async (req: Request, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const type = req.body.type as PostType

    console.log(req.body)

    if (!title || !req.user?.id || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, and user are required',
      })
    }

    const parsedTags: string[] =
      type === 'blog' && tags
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []

    const mediaUrls: string[] = [];

    if (type === 'image') {
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        files.forEach((file) => {
          mediaUrls.push(file.path);
        });
      }
    }

    if (type === 'video') {
      const file = req.file as Express.Multer.File
      if (file) {
        mediaUrls.push(file.path)
      }
    }

    if (!title || !req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Title and user are required",
      });
    }

    const newPost = await Post.create({
      type,
      media: mediaUrls,
      title,
      description,
      tags: parsedTags,
      uploadedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Post uploaded successfully",
      post: newPost,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};


const getPosts = async (req: Request, res: Response) => {
  try {
    const { type } = req.query
    const { id } = req.params

    const filter: any = {}
    if (type) filter.type = type

    if (id) {
      const post = await Post.findById(id)
        .populate('uploadedBy', 'userName avatar')
        .populate('comments.user', 'userName avatar')  // ← populate comment authors too
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        })
      }
      return res.status(200).json({
        success: true,
        post
      })
    }

    const posts = await Post.find(filter).sort('-createdAt')

    res.status(200).json({
      success: true,
      posts,
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const getPostStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id

    const stats = await Post.aggregate([
      {
        $match: {
          uploadedBy: new mongoose.Types.ObjectId(String(userId))
        }
      },
      {
        $group: {
          _id: "$type",
          totalMedia: { $sum: { $size: "$media" } },
          totalPosts: { $sum: 1 }
        }
      }
    ])

    const result = { images: 0, videos: 0, blogs: 0 }

    stats.forEach((stat) => {
      if (stat._id === "image") result.images = stat.totalMedia
      if (stat._id === "video") result.videos = stat.totalMedia
      if (stat._id === "blog")  result.blogs  = stat.totalPosts
    })

    res.status(200).json({ success: true, stats: result })

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// ─── new controllers ───────────────────────────────────────────────────────────

const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = new mongoose.Types.ObjectId(String(req.user!.id))

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    const alreadyLiked = post.likes.some(
      (likeId: mongoose.Types.ObjectId) => likeId.toString() === userId.toString()
    )

    const updated = await Post.findByIdAndUpdate(
      id,
      alreadyLiked
        ? { $pull: { likes: userId } }       // unlike
        : { $addToSet: { likes: userId } },   // like
      { new: true }
    )

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: updated?.likes.length ?? 0
    })

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { text } = req.body
    const userId = req.user!.id

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' })
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            user: userId,
            text: text.trim(),
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('comments.user', 'userName avatar')

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    return res.status(200).json({
      success: true,
      comments: post.comments
    })

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params
    const userId = req.user!.id

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $pull: {
          comments: {
            _id: new mongoose.Types.ObjectId(commentId),
            user: userId   // ensures only the comment owner can delete
          }
        }
      },
      { new: true }
    )

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Comment deleted'
    })

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


// ─── exports ───────────────────────────────────────────────────────────────────

export {
  uploadPost,
  getPosts,
  getPostStats,
  toggleLike,
  addComment,
  deleteComment
}