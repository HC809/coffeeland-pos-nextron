import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { cancelNewOrder } from "@/store/newOrderSlice";
import { useModalAction } from "../modal-views/context";
import { useRouter } from "next/router";
import routes from "@/config/routes";

export default function CancelNewOrderForm() {
  const router = useRouter();
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const cancelOrder = async () => {
    await dispatch(cancelNewOrder());
    router.push(routes.home);
    closeModal();
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Cancelar Orden
            </h1>
            <p> ¿Estás seguro de que quieres cancelar esta orden?</p>
          </div>
          <>
            <Button
              type="button"
              onClick={cancelOrder}
              variant="solidDanger"
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
            >
              Cancelar Venta
            </Button>
          </>
        </div>
      </div>
    </div>
  );
}
