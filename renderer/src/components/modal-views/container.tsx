import { useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  MODAL_VIEWS,
  useModalAction,
  useModalState,
} from "@/components/modal-views/context";
import { Dialog } from "@/components/ui/dialog";
import { Transition } from "@/components/ui/transition";
import { CloseIcon } from "@/components/icons/close-icon";

const NewOrderView = dynamic(
  () => import("@/components/new-order/new-order-view")
);
const NewOrderInvoiceDetailView = dynamic(
  () => import("@/components/new-order/new-order-invoice-detail")
);
const EndNewOrderView = dynamic(
  () => import("@/components/new-order/end-new-order-view"),
  {
    ssr: false,
  }
);
const CancelNewOrderView = dynamic(
  () => import("@/components/new-order/cancel-order-view")
);
const UpdateProductsView = dynamic(
  () => import("@/components/general/update-products-view")
);
const PrinterConfigView = dynamic(
  () => import("@/components/general/printer-config-view"),
  {
    ssr: false,
  }
);

function renderModalContent(view: MODAL_VIEWS) {
  switch (view) {
    case "NEW_ORDER_VIEW":
      return <NewOrderView />;
    case "NEW_ORDER_INVOICE_DETAIL_VIEW":
      return <NewOrderInvoiceDetailView />;
    case "END_NEW_ORDER_VIEW":
      return <EndNewOrderView />;
    case "CANCEL_NEW_ORDER_VIEW":
      return <CancelNewOrderView />;
    case "UPDATE_PRODUCTS_VIEW":
      return <UpdateProductsView />;
    case "PRINTER_CONFIG_VIEW":
      return <PrinterConfigView />;
    default:
      return null;
  }
}

export default function ModalsContainer() {
  const router = useRouter();
  const { view, isOpen } = useModalState();
  const { closeModal } = useModalAction();
  useEffect(() => {
    // close search modal when route change
    router.events.on("routeChangeStart", closeModal);
    return () => {
      router.events.off("routeChangeStart", closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="xs:p-4 fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
        onClose={closeModal}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="bg-dark fixed inset-0 z-40 cursor-pointer bg-opacity-60 backdrop-blur dark:bg-opacity-80" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-110"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-110"
          >
            <div className="text-start xs:min-h-[auto] xs:w-auto relative z-50 inline-block min-h-screen w-full transform overflow-hidden align-middle transition-all">
              <div className="bg-light dark:bg-dark-300 xs:block xs:min-h-[auto] xs:rounded-md relative flex min-h-screen items-center overflow-hidden">
                <button
                  onClick={closeModal}
                  aria-label="Close panel"
                  className="text-dark-900 hover:text-dark dark:text-dark-800 hover:dark:text-light-200 absolute top-5 right-4 z-10 outline-none transition-all focus-visible:outline-none md:top-6 md:right-5 lg:top-7 lg:right-7"
                >
                  <CloseIcon className="3xl:h-5 3xl:w-5 h-4 w-4 focus-visible:outline-none lg:h-[18px] lg:w-[18px]" />
                </button>
                <div className="h-full w-full">
                  {view && renderModalContent(view)}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
