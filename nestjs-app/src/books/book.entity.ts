// The shape of a book row. (With TypeORM this would be a class with @Entity().)
export interface Book {
  id: number;
  title: string;
  author: string;
  year: number | null;
}
