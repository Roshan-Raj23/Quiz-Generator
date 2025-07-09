import { toast } from "sonner";

export default function validation(email: string , password: string): boolean {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);

    if (!emailValid) {
        toast.warning("Email not in correct format");
        return false;
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const passwordValid = passwordRegex.test(password);
    if (!passwordValid || password.length > 16) {
        if (password.length < 8) {
            toast.warning("Password must be at least 8 characters long")
        } else if (password.length > 16) {
            toast.warning("Password must be at most 16 characters long")
        } else if (!/[a-z]/.test(password)) {
            toast.warning("Password must include at least one lowercase letter")
        } else if (!/[A-Z]/.test(password)) {
            toast.warning("Password must include at least one uppercase letter")
        } else if (!/\d/.test(password)) {
            toast.warning("Password must include at least one digit")
        } else if (!/[\W_]/.test(password)) {
            toast.warning("Password must include at least one special character")
        } else {
            toast.warning("Password not valid")
        }
        return false;
    }

    return true;
}