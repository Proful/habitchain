"use client"

import { z } from "zod"

const postFormSchema = z.object({
  name: z.string().min(2).max(50),
  title: z.string().min(2).max(250),
  website: z.string().min(2).max(150),
  img_url: z.string().min(2).max(150),
  affiliate_pc: z.number(),
  affiliate_link: z.string().min(2).max(150),
  description: z.string().min(2).max(450),
})

export {
  postFormSchema
}
