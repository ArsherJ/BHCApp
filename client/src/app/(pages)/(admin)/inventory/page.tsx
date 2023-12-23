"use client";
import React, { Suspense, useEffect, useState } from "react";
import RegistrationCard from "../../../components/RegistrationCard";
import DashboardDrawer from "../../../components/DashboardDrawer";
import NavbarDashboard from "../../../components/NavbarDashboard";
import {
  doctorModalActions,
  medicineModalActions,
  medicineQuantityModalActions,
  userDetailsActions,
} from "../../../redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useVerification from "../../../hooks/api-hooks/useVerification";
import EmergencyModal from "../../../components/modals/EmergencyModal";
import {
  IRoot,
  EnumUserRole,
  IMedicine,
  EnumDoctorStatus,
  EnumMedicineModalType,
  EnumMedicineQuantityModalType,
} from "../../../redux/interfaces";
import PageLoader from "../../../components/loaders/PageLoader";
import DataTable, { TableColumn } from "react-data-table-component";
import Image from "next/image";
import { customStyles } from "../../../components/datatable/datatable-theme";
import AlertMessage from "../../../components/AlertMessage";
import AddDoctorModal from "../../../components/modals/doctors/AddDoctorModal";
import DoctorConfirmModal from "../../../components/modals/doctors/DoctorConfirmModal";
import { FaUserEdit, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { IoSearchCircleSharp } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillMedicineBox } from "react-icons/ai";
import AddMedicineModal from "../../../components/modals/medicine/AddMedicineModal";
import MedicineConfirmationModal from "../../../components/modals/medicine/MedicineConfirmModal";
import useGetMedicines from "../../../hooks/api-hooks/medicineAPI/useGetMedicines";
import TableLoader from "../../../components/loaders/TableLoader";
import Loading from "./loading";
import MedicineQuantitynModal from "@/app/components/modals/medicine/MedicineQuantityModal";

const InventoryPage = () => {
  const [filterText, setFilterText] = useState<string>("");
  const dispatch = useDispatch();
  const {
    data: dataMedicines,
    loading: isLoadingMedicines,
    error: errorMedicines,
    getMedicines,
  } = useGetMedicines();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );
  const showMedicineModal = useSelector(
    (state: IRoot) => state.medicineModal.showMedicineModal
  );
  const showMedicineConfirmationModal = useSelector(
    (state: IRoot) => state.medicineModal.showMedicineConfirmationModal
  );
  const showMedicineQuantityModal = useSelector(
    (state: IRoot) => state.medicineQuantityModal.showMedicineQuantityModal
  );

  const filterByName = dataMedicines?.filter((item: IMedicine) => {
    return (
      item.medicine &&
      item.medicine.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const medicineColumns: TableColumn<IMedicine>[] = [
    {
      name: "Image",
      // @ts-ignore
      selector: (row) => {
        if (row.image) {
          const imageURL = row.image;
          const imageSpan = (
            <span>
              <Image
                src={imageURL}
                alt="Medicine Image"
                width={65}
                height={65}
                className="py-2 max-h-120 max-w-120"
              />
            </span>
          );
          return imageSpan;
        } else {
          return (
            <span>
              <Image
                src={"/medicine.jpeg"}
                alt="Medicine Image"
                width={65}
                height={65}
                className="py-2 max-h-120 max-w-120"
              />
            </span>
          );
        }
      },
    },
    {
      name: "Medicine",
      selector: (row) => row.medicine,
      sortable: true,
      id: "name",
      compact: true,
      wrap: true,
    },
    {
      name: "Dosage",
      selector: (row) => row.dosage,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Quantity",
      cell: (row: { quantity: number }) => (
        <div className="justify-center text-center items-center flex flex-row py-3 gap-3">
          <button
            className={`text-primary btn btn-circle btn-xs ${row.quantity == 0 && `opacity-30`}`}
            disabled={row.quantity == 0}
            onClick={() => {
              dispatch(medicineQuantityModalActions.setMedicineDetails(row));
              dispatch(
                medicineQuantityModalActions.toggleMedicineQuantityModal()
              );
              dispatch(
                medicineQuantityModalActions.setMedicineQuantityModalType(
                  EnumMedicineQuantityModalType.DECREASE
                )
              );
            }}
          >
            <FaMinus size={15} className={`text-[#fc2929]`} />
          </button>
          {row.quantity} pcs
          <button
            className={`text-primary btn btn-circle btn-xs`}
            onClick={() => {
              dispatch(medicineQuantityModalActions.setMedicineDetails(row));
              dispatch(
                medicineQuantityModalActions.toggleMedicineQuantityModal()
              );
              dispatch(
                medicineQuantityModalActions.setMedicineQuantityModalType(
                  EnumMedicineQuantityModalType.INCREASE
                )
              );
            }}
          >
            <FaPlus size={15} className={`text-primary`} />
          </button>
        </div>
      ),
      sortable: true,
      compact: true,
      wrap: true,
    },

    {
      name: "Action",
      compact: true,
      wrap: true,
      cell: (row) => (
        <div className="justify-center text-center items-center flex flex-row py-3 gap-3">
          <button
            className={`text-primary btn btn-square`}
            onClick={() => {
              dispatch(medicineModalActions.setMedicineDetails(row));
              dispatch(medicineModalActions.toggleMedicineModal());
              dispatch(
                medicineModalActions.setMedicineModalType(
                  EnumMedicineModalType.UPDATE
                )
              );
            }}
          >
            <RiEdit2Fill size={25} className={`text-primary`} />
          </button>
          <button
            className={`text-primary btn btn-square`}
            onClick={() => {
              dispatch(medicineModalActions.setMedicineDetails(row));
              dispatch(medicineModalActions.toggleMedicineConfirmationModal());
            }}
          >
            <FaTrash size={20} className={`text-[#fc2929]`} />
          </button>
        </div>
      ),
    },
  ];

  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const { role: userRole, isAuth } = userDetails;

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }
  const content = (
    <div data-theme="lemonade" className="">
      <Suspense fallback={<Loading />}>
        <DashboardDrawer />
        <NavbarDashboard />
        <div className="flex flex-col relative px-4 pb-8 pt-[102px]">
          <div className="flex flex-col md:flex-row justify-between items-center mt-2 gap-4 mb-8">
            <div className="md:ml-4 capitalize">
              <h4>Medicine List</h4>
            </div>

            <div className="flex flex-between items-center justify-center flex-wrap gap-3">
              <div className="flex flex-row gap-4">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    dispatch(medicineModalActions.toggleMedicineModal());
                    dispatch(
                      medicineModalActions.setMedicineModalType(
                        EnumMedicineModalType.ADD
                      )
                    );
                  }}
                >
                  <AiFillMedicineBox size={18} />
                  Add Medicine
                </button>
              </div>
              {/* Search Input */}
              <div className="relative w-40">
                <input
                  type="text"
                  placeholder="Search Name"
                  className="w-full pr-10 input input-primary input-bordered text-[14px]"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                  <IoSearchCircleSharp className="text-primary" />
                </button>
              </div>
            </div>
          </div>
          {isLoadingMedicines && <TableLoader />}
          {dataMedicines && (
            <DataTable
              columns={medicineColumns}
              data={filterByName}
              customStyles={customStyles}
              dense
              pagination
              paginationPerPage={5}
              defaultSortAsc
              defaultSortFieldId="name"
              striped
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          )}
        </div>
        {showMedicineModal && <AddMedicineModal />}
        {showMedicineConfirmationModal && <MedicineConfirmationModal />}
        {showMedicineQuantityModal && <MedicineQuantitynModal />}
        <AlertMessage />
      </Suspense>
    </div>
  );

  if (isAuth === true && userRole === EnumUserRole.ADMIN) {
    return content;
  }
};

export default InventoryPage;
