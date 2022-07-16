import { useAppSelector } from "@/hooks/reduxHooks";
import {
  formatInvoice,
  formatNumber,
  toShortDate,
  hourFormat,
} from "../../helpers/functions/general";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { useState } from "react";
import { ISale } from "@/models/ISale";

interface Props {
  sale: ISale;
}

export default function SaleDetailTabs({ sale }: Props) {
  const { orderTypes } = useAppSelector(selectGeneralInfo);

  const [tab, setTab] = useState<string>("1");

  const { orderInfo, orderDetail } = sale;

  const {
    total,
    subtotal,
    totalDiscount,
    totalExempt,
    totalExonerated,
    totalTax15,
    totalTax18,
    taxableAmount15,
    taxableAmount18,
    totalTax,
  } = sale?.orderAmounts || {};

  return (
    <>
      <div className="mb-4 content-center border-b border-gray-200 text-center dark:border-gray-700">
        <ul
          className="-mb-px flex flex-wrap justify-center text-center text-sm font-medium"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className="inline-block rounded-t-lg border-b-2 p-4 text-lg"
              onClick={() => setTab("1")}
              id="profile-tab"
              data-tabs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
            >
              Información
            </button>
            <button
              className="inline-block rounded-t-lg border-b-2 p-4 text-lg"
              onClick={() => setTab("2")}
              id="profile-tab"
              data-tabs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
            >
              Factura
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className="inline-block rounded-t-lg border-b-2 border-transparent p-4 text-lg hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setTab("3")}
              id="dashboard-tab"
              data-tabs-target="#dashboard"
              type="button"
              role="tab"
              aria-controls="dashboard"
              aria-selected="false"
            >
              Detalle
            </button>
          </li>
        </ul>
      </div>
      <div id="myTabContent">
        <div
          className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          id="dashboard"
          role="tabpanel"
          aria-labelledby="dashboard-tab"
        >
          {tab === "1" && (
            <>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>N° Factura:</span>
                <span>
                  {formatInvoice(
                    orderInfo?.establishmentNumber || 0,
                    orderInfo?.invoicePointNumber || 0,
                    orderInfo?.documentTypeNumber || 0,
                    orderInfo?.invoiceNumber || 0
                  )}
                </span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Cliente:</span>
                <span>{orderInfo?.customerName}</span>
              </div>
              {orderInfo?.rtn && (
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>RTN:</span>
                  <span>{orderInfo?.rtn}</span>
                </div>
              )}
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Tipo Orden:</span>
                <span>
                  {
                    orderTypes.find(
                      (item) => item.code === orderInfo?.orderTypeCode
                    )?.name
                  }
                </span>
              </div>
              {orderInfo?.orderTypeCode === "COMERAQUI" && (
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Ticket Mesa:</span>
                  <span>{orderInfo?.ticketNumber || 0}</span>
                </div>
              )}
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Fecha:</span>
                <span>{toShortDate(orderInfo?.date!)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between text-base font-medium">
                <span>Hora:</span>
                <span>{hourFormat(orderInfo?.date!)}</span>
              </div>
            </>
          )}
        </div>
        <div
          className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          {tab === "2" && (
            <>
              <div className="text-dark text-dark-500 dark:text-light flex justify-between pb-4 text-base font-medium">
                <span>Factura N°</span>
                <span>
                  {formatInvoice(
                    orderInfo?.establishmentNumber || 0,
                    orderInfo?.invoicePointNumber || 0,
                    orderInfo?.documentTypeNumber || 0,
                    orderInfo?.invoiceNumber || 0
                  )}
                </span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Subtotal:</span>
                <span>L {formatNumber(subtotal || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Descuentos y Rebajas:</span>
                <span>L {formatNumber(totalDiscount || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Exento:</span>
                <span>L {formatNumber(totalExempt || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Exonerado:</span>
                <span>L {formatNumber(totalExonerated || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Gravado 15%:</span>
                <span>L {formatNumber(taxableAmount15 || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Gravado 18%:</span>
                <span>L {formatNumber(taxableAmount18 || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Impuestos del 15%:</span>
                <span>L {formatNumber(totalTax15 || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Impuestos del 18%:</span>
                <span>L {formatNumber(totalTax18 || 0)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Total Impuesto:</span>
                <span>L {formatNumber(totalTax || 0)}</span>
              </div>
              <div className="text-dark text-dark-500 dark:text-light flex justify-between text-lg  font-medium">
                <span>Total a Pagar:</span>
                <span>L {formatNumber(total || 0)}</span>
              </div>
            </>
          )}
        </div>
        <div
          className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          id="dashboard"
          role="tabpanel"
          aria-labelledby="dashboard-tab"
        >
          {tab === "3" &&
            orderDetail.map((item) => (
              <div key={item.productId} className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>{`${item.productName} X ${item.quantity}`}</span>
                <span>L {formatNumber(item.total || 0)}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
