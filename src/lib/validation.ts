import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Roles } from "@/enums";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, dashes, and underscores"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .max(100, "Email address cannot exceed 100 characters")
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val === Roles.Artist || val === Roles.Collector, {
      message: `Invalid account type. Only Collector (${Roles.Collector}) or Artist (${Roles.Artist}) is allowed.`,
    })
    .default(Roles.Collector),
});

export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_new_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "New password and confirmation password do not match",
    path: ["confirm_new_password"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

export async function parseRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return (await request.json()) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    try {
      const formData = await request.formData();
      const data: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        data[key] = value instanceof File ? value : value.toString();
      });
      return data;
    } catch {
      return {};
    }
  }

  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<
  | { success: true; data: T }
  | { success: false; response: NextResponse }
> {
  const body = await parseRequestBody(request);
  const result = schema.safeParse(body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    const firstErrorMessage = formattedErrors[0]?.message || "Validation failed";

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: firstErrorMessage,
          details: formattedErrors,
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}
