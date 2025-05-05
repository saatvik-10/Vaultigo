import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),

  //files and folders info
  name: text('name').notNull(),
  path: text('path').notNull(), // /document/project/...
  size: integer('size').notNull(),
  type: text('type').notNull(), // file or folder

  //storage info
  fileUrl: text('file_url').notNull(), //url to the file
  thumbnailUrl: text('thumbnail_url'),

  //owership info
  userId: text('user_id').notNull(),
  parentId: uuid('parent'), //parent folder id

  //file/folder flags
  isFolder: boolean('is_folder').notNull().default(false),
  isStarred: boolean('is_starred').notNull().default(false),
  isTrashed: boolean('is_trashed').notNull().default(false),

  //timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/*
parent:Each file/folder can have one parent folder
children:Each folder can have many files/folders
*/

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId], //foreign key
    references: [files.id], //primary key
  }),

  //relationship to files/folders
  children: many(files),
}));

//Type definitions
export type File = typeof files.$inferSelect; //retrieve data from the database

export type NewFile = typeof files.$inferInsert; //insert data into the database
