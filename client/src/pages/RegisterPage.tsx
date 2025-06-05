import useAuthStore from "../store/useAuthStore"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {

  const navigate = useNavigate();

  const { register: registerUser } = useAuthStore();
  
  const { register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password
    };
    try {
      await registerUser(userData);
      console.log("Registration successful");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username")} />
          {errors.username && <span className="text-red-500">{errors.username.message}</span>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        {errors.root && <span className="text-red-500">{errors.root.message}</span>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
        <button type="button" onClick={() => navigate("/login")}>
          Already have an account? Log in
        </button>
      </form>
    </div>
  );
}