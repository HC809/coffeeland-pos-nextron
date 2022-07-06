import * as yup from "yup";
import { useForm } from "react-hook-form";
import Password from "@/components/ui/forms/password";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { login } from "@/store/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { ApiNoTokenService } from "@/api/principalService";
import { ILoggedUser } from "@/models/Authentication/Authentication.models";
import toast from "react-hot-toast";
import { setAuthUser } from "@/services/AuthenticationService";
import { getAxiosErrorMessage } from "@/helpers/manageAxiosError";
import { AxiosError } from "axios";

export interface IFormValues {
  username: string;
  password: string;
}

const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
  username: yup.string().required("Ingrese su usuario."),
  password: yup.string().required("Ingrese su contraseña."),
});

export default function LoginUserForm() {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setLoading(null as any);
    };
  }, []);

  const initialValues: IFormValues = {
    username: "",
    password: "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({ username, password }: IFormValues) => {
    setLoading(true);

    const credentials = {
      username: username,
      password: password,
    };

    try {
      const { data, success, errorMessage } = await ApiNoTokenService.login(
        credentials
      );

      if (success) {
        const { username, name, role, token } = data;
        console.log(role);
        if (role !== "POS" && role !== "ADMIN") {
          toast.error(`No tiene permisos suficientes para ingresar.`);
        } else {
          const loggedUser: ILoggedUser = {
            username,
            name,
            token,
            logged: true,
          };
          await setAuthUser(loggedUser);
          await dispatch(login(data));
        }
      } else {
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error as AxiosError);
      toast.error(`Error al inciar sesión: ${errorMessage}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-10 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center ">
            <img
              width="200px"
              height="150px"
              className="ml-auto mr-auto"
              src="/images/coffeeland-logo.png"
            />
          </div>
          <div className="pb-5 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Coffee Land POS
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 pt-4 lg:space-y-5"
          >
            <>
              <Input
                label="Usuario"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("username")}
                error={errors.username?.message}
              />
              <Password
                label="Contraseña"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("password")}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              >
                Iniciar Sesión
              </Button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
