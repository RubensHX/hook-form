import { useForm, useFieldArray } from "react-hook-form";
import "./styles/global.css";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((avatar) => avatar[0])
    .refine(
      (file) => file?.size <= 5 * 1024 * 1024,
      "File must be less than 5MB"
    ),
  name: z
    .string()
    .nonempty("Name is required")
    .transform((name) =>
      name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ")
    ),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email")
    .toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("Title is required"),
        knowledge: z.coerce
          .number()
          .min(1, "Knowledge must be at least 1")
          .max(10, "Knowledge must be at most 10"),
      })
    )
    .min(2, "You must have at least 2 techs"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export function App() {
  const [output, setOutput] = useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "techs",
    control,
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  function handleSignUp(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-50 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            accept="image/*"
            id="avatar"
            {...register("avatar")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            className="border border-emerald-50 shadow-sm rounded h-10 bg-zinc-800"
            type="text"
            id="name"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            className="border border-emerald-50 shadow-sm rounded h-10 bg-zinc-800"
            type="email"
            id="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            className="border border-emerald-50 shadow-sm rounded h-10 bg-zinc-800"
            type="password"
            id="password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Techs
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Add
            </button>
          </label>
          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex flex-col-1">
                  <input
                    type="text"
                    id="title"
                    {...register(`techs.${index}.title`)}
                    className="flex-1 border border-emerald-50 shadow-sm rounded h-10 bg-zinc-800"
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col-1">
                  <input
                    type="number"
                    id="knowledge"
                    {...register(`techs.${index}.knowledge`)}
                    className="w-16 flex-1 border border-emerald-50 shadow-sm rounded h-10 bg-zinc-800"
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Sign up
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}
