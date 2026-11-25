# NestJS for Express developers

NestJS runs **on top of Express** but adds structure: modules, classes, decorators and dependency injection. It looks like Angular or Spring.

## Run

```bash
cd nestjs-app
pnpm install
pnpm start:dev    # http://localhost:4002, rebuilds on save
```

## Folder structure

```
src/                              Express equivalent
├── main.ts                       server.js
├── app.module.ts                 app.js (wires everything together)
├── app.controller.ts             GET / route
├── common/
│   ├── logger.middleware.ts      middleware/logger.js
│   └── auth.guard.ts             middleware/auth.js
├── database/
│   ├── database.module.ts        (no equivalent: makes the DB injectable)
│   └── database.service.ts       db.js
└── books/                        one folder per feature
    ├── books.module.ts           (no equivalent)
    ├── books.controller.ts       routes/ + controllers/
    ├── books.service.ts          models/
    ├── book.entity.ts            the Book type
    └── dto/create-book.dto.ts    validators/
```

## Side by side

### 1. Create and start

```ts
const app = await NestFactory.create(AppModule)
await app.listen(4002)
```

### 2. Routes are methods with decorators

```ts
// Express
router.get('/:id', getBook)

// NestJS
@Controller('books')
export class BooksController {
  @Get(':id')
  findOne(...) { return this.booksService.findOne(id) }   // returned value → JSON
}
```

POST returns 201 by default. Use `@HttpCode(204)` to change it.

### 3. URL params and query

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number)          // req.params.id, as a number

@Get()
findAll(@Query('author') author?: string)               // req.query.author
```

### 4. Body validation: DTO class + decorators

```ts
export class CreateBookDto {
  @IsString() @Length(1, 100) title: string
}

@Post()
create(@Body() dto: CreateBookDto)
```

`app.useGlobalPipes(new ValidationPipe(...))` in [main.ts](src/main.ts) checks every DTO.

### 5. Middleware

The same `(req, res, next)`, wrapped in a class and registered in a module:

```ts
consumer.apply(LoggerMiddleware).forRoutes('*')   // app.use(requestLogger)
```

### 6. Auth → guards

```ts
@Post()
@UseGuards(AuthGuard)      // router.post('/', requireToken, ...)
create(...)
```

A guard returns `true` to allow the request, or throws `UnauthorizedException`.

### 7. Errors and 404

```ts
throw new NotFoundException('Book not found')   // res.status(404).json(...)
```

Nest turns exceptions into JSON and handles unknown routes for you. For a custom format, write an exception filter (`@Catch()`).

### 8. Database

Here it's the same SQL in a service. Real projects use TypeORM or Prisma.

### 9. Config

`ConfigModule.forRoot()` loads `.env`. Then inject `ConfigService` and call `config.get('API_TOKEN')`.

### 10. Modules and dependency injection

This is the big difference from Express.

```ts
// Express: you import and call
import { Book } from '../models/book.model.js'

// NestJS: you ask for it in the constructor, and Nest creates and passes it in
constructor(private readonly booksService: BooksService) {}
```

For this to work, register the class with `@Injectable()` and add it to a module's `providers`. To use it from another module, list it in `exports`, and add that module to the other module's `imports`.

## Request lifecycle

```
middleware → guards → interceptors → pipes (validation) → controller → service
exceptions anywhere → exception filters → JSON error
```

## Gotchas

- "Nest can't resolve dependencies of X" means you forgot to add it to `providers` or `imports`.
- A DTO must be a **class**, not an interface. Validation needs the class at runtime.
- Use `nest g resource books` to generate a module, controller, service and DTOs in one go.

## Learn next

TypeORM or Prisma, `@nestjs/swagger`, `@nestjs/jwt` with Passport, interceptors, and testing with `@nestjs/testing`.
