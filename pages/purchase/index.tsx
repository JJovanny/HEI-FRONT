import { strings } from "src/resources/locales/i18n";
import MainLayout from "components/layout/MainLayout";
import { PurchaseList } from "components/purchase/purchaseList";

export default function PurchasePage() {
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className="pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom">
          <div className="container-xl">
            <div>
              <div className="row align-items-center">
                <div className="col">
                  <h1 className="h2 mb-0 text-white">Compras</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <PurchaseList />
      </MainLayout>
    </>
  );
}
