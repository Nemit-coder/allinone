import crypto from "crypto"

export const generateResetCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit

  const hashedCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex")

  return { code, hashedCode }
}
