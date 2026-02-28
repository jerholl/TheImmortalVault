import {defineField, defineType} from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(5)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {source: "title", maxLength: 96},
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(280)
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: {hotspot: true}
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{type: "block"}],
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage"
    }
  },
  orderings: [
    {
      title: "Publish date, newest",
      name: "publishedAtDesc",
      by: [{field: "publishedAt", direction: "desc"}]
    }
  ]
});
