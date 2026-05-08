import Post from "../models/post.model";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { PostType } from "../types/post.type";

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
    
    const parsedTags : string[] = 
    type === 'blog' && tags
    ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : []
    
    const mediaUrls: string[] = [];

    if(type === 'image'){
      const files = req.files as Express.Multer.File[];

       if (files && files.length > 0) {
      files.forEach((file) => {
        mediaUrls.push(
          `uploads/posts/${req.user?.id}/${file.filename}`
        );
      });
    }
    }

    if(type === 'video'){
      const file = req.file as Express.Multer.File
      if(file ){
        mediaUrls.push(`uploads/posts/${req.user?.id}/${file.filename}`)
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


const getPosts = async (req: Request , res: Response) => {
    try {

        const posts = await Post.find()

        // console.log(posts)
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
          // for image/video: sum all items in media array
          // for blog: media is [] so $sum of $size gives 0, so we add postCount separately
          totalMedia: { $sum: { $size: "$media" } },
          totalPosts: { $sum: 1 }
        }
      }
    ])

    // shape the result into a clean object
    const result = {
      images: 0,
      videos: 0,
      blogs: 0
    }

    stats.forEach((stat) => {
      if (stat._id === "image") result.images = stat.totalMedia
      if (stat._id === "video") result.videos = stat.totalMedia
      if (stat._id === "blog")  result.blogs  = stat.totalPosts
    })

    // console.log(result)
    res.status(200).json({
      success: true,
      stats: result
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export  {
    uploadPost,
    getPosts,
    getPostStats
}