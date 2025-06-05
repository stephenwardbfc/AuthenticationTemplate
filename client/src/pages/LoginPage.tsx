import useAuthStore from "../store/useAuthStore"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>


export default function LoginPage() {

  const navigate = useNavigate();

  const { login } = useAuthStore();

  const { register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const userData = {
      email: data.email,
      password: data.password
    };
    try {
      await login(userData);
      console.log("Login successful");

    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle error (e.g., show a notification)
      setError("root", {
        type: "manual",
        message: error.message,
      })
    }
  }


  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register("email")}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input {...register("password")} />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        {errors.root && <span className="text-red-500">{errors.root.message}</span>}

        <button
          type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-white"
        >
          Register
        </button>

      </form>

    </div>
  )
}
