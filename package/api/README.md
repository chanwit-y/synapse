- ใช้ generate migration file
- มันจะดู diff ระหว่าง schema ที่คุณเขียนใน schema.ts กับ DB (หรือ snapshot ล่าสุด)
- แล้วสร้างไฟล์ migration .sql อัตโนมัติไว้ใน /drizzle/migrations/
- ยังไม่ได้ apply ลง DB นะ แค่ generate ไฟล์
```sh
npx drizzle-kit generate
```
- migrate ขึ้น db
```sh
npx drizzle-kit migrate
```

- ทางลัด มันจะ push ขึ้นไปเลย แต่ไม่แน่นำให้ใช้ เพราะจะไม่มี file migration
```sh
npx drizzle-kit push
```

supabase enable vector extension
```sql
create extension if not exists vector;
```