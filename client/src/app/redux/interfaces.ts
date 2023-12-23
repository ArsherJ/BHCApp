import { StaticImageData } from "next/image";
import {
  DateRangeType,
  DateType,
  DateValueType,
} from "react-tailwindcss-datepicker";

export enum EnumUserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum EnumSettingsTab {
  USER_DETAILS,
  CHANGE_PASSWORD,
}

export enum EnumGender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum EnumDoctorModalType {
  ADD,
  UPDATE,
  VIEW
}

export enum EnumNewsModalType {
  ADD,
  UPDATE,
  VIEW,
}

export enum EnumMedicineModalType {
  ADD,
  UPDATE,
}

export enum EnumMedicineQuantityModalType {
  INCREASE,
  DECREASE,
}

export enum EnumAppointmentConfirmModal {
  ACCEPT,
  BULK_ACCEPT,
  REJECT,
  BULK_REJECT,
}

export enum EnumPhilhealthStatus {
  None = 2,
  Active = 1,
  Inactive = 0,
}

export enum EnumCovidVaccineStatus {
  NONE = "None",
  VACCINATED = "Vaccinated",
  NOT_VACCINATED = "Not Vaccinated",
  BOOSTED = "Boosted",
}

export enum EnumPWD {
  None = 2,
  Yes = 1,
  No = 0,
}

export enum EnumTobaccoUse {
  None = 2,
  Yes = 1,
  No = 0,
}

export enum EnumSenior {
  NONE = 2,
  YES = 1,
  NO = 0,
}

export enum EnumMentalHealthStatus {
  STABLE = "Stable",
  RECOVERING = "Recovering",
  UNSTABLE = "Unstable",
  WELL = "Well",
  DECLINING = "Declining",
  UNKNOWN = "Unknown",
}

export enum EnumInjury {
  NONE = "None",
  SPRAIN = "Sprain",
  FRACTURE = "Fracture",
  CUT = "Cut",
  BRUISE = "Bruise",
  BURN = "Burn",
  DISLOCATION = "Dislocation",
  CONCUSSION = "Concussion",
  OTHER = "Other",
}

export enum EnumAppointmentStatus {
  PENDING = 2,
  ACCEPTED = 1,
  REJECTED = 0,
}

export enum EnumDoctorStatus {
  INACTIVE = 2,
  ACTIVE = 1,
  ONLEAVE = 0,
}

export enum EnumAlerts {
  SUCCESS,
  ERROR,
}

export enum EnumAppointmentTime {
  "8:00 AM" = "8:00 AM",
  "8:30 AM" = "8:30 AM",
  "9:00 AM" = "9:00 AM",
  "9:30 AM" = "9:30 AM",
  "10:00 AM" = "10:00 AM",
  "10:30 AM" = "10:30 AM",
  "11:00 AM" = "11:00 AM",
  "11:30 AM" = "11:30 AM",
  "12:00 PM" = "12:00 PM",
  "12:30 PM" = "12:30 PM",
  "1:00 PM" = "1:00 PM",
  "1:30 PM" = "1:30 PM",
  "2:00 PM" = "2:00 PM",
  "2:30 PM" = "2:30 PM",
  "3:00 PM" = "3:00 PM",
  "3:30 PM" = "3:30 PM",
  "4:00 PM" = "4:00 PM",
  "4:30 PM" = "4:30 PM",
  "5:00 PM" = "5:00 PM",
}

export enum EnumAppointmentReason {
  CHECKUP = "Checkup",
  IMMUNIZATION = "Immunization",
  DENTAL = "Dental",
  MIDWIFE = "Midwife",
  LABORATORIES = "Laboratories",
  CHEST_XRAY = "Chest X-Ray",
  HEALTH_CERTIFICATE = "Health Certificate",
  COVID_VACCINE = "Covid Vaccine",
  ANTIGEN = "Antigen",
}

export interface IUserDetails {
  userDetails: IPatientDetails;
}

export interface IPatientDetails {
  user_id: any;
  isAuth?: boolean;
  first_name: string;
  last_name: string;
  birthday: string;
  contact: string;
  address: string;
  sex: string;
  email: string;
  username: string;
  role: string;
  records?: IPatientRecords;
}

export interface IPatientRecords {
  cesarean_section?: string;
  philhealth_status?: string;
  philhealth_id?: string;
  head_of_the_family?: string;
  covid_status?: string;
  tobacco_use?: string;
  blood_pressure?: string;
  per_rectum?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  temperature?: number;
  pwd?: string;
  senior?: string;
  injury?: string;
  mental_health?: string;
}

export interface IEditUserDetails {
  editUserDetails: {
    id?: Number;
    isAuth?: boolean;
    first_name: string;
    last_name: string;
    birthday: string;
    contact: string;
    address: string;
    sex: string;
    email: string;
    username: string;
    role: string;
    cesarean_section?: string;
    philhealth_status?: string;
    philhealth_id?: string;
    head_of_the_family?: string;
    covid_status?: string;
    tobacco_use?: string;
    blood_pressure?: string;
    per_rectum?: string;
    weight?: number;
    height?: number;
    bmi?: number;
    temperature?: number;
    pwd?: string;
    senior?: string;
    injury?: string;
    mental_health?: string;
  };
  showDeleteUserModal: boolean;
}
export interface IUserAuth {
  authValues: {
    username: string;
    password: string;
  };
}
export interface IAuthModal {
  showModal: boolean;
}
export interface IAlertMessage {
  showAlert: boolean;
  alertDetails: {
    alertType: EnumAlerts;
    alertMessage: string;
  };
}
export interface IAppointmentRequestModal {
  refetchAppointment: boolean;
  showAppointmentModal: boolean;
  showConfirmationModal: boolean;
  confirmModalType: EnumAppointmentConfirmModal;
  selectedAppointmentRows?: IAppointment[];
  appointmentConfirmationDetails: {
    id?: any;
    name: string;
    appointment_date: string;
    appointment_time: string;
    appointment_reason: string;
    appointment_status: EnumAppointmentStatus;
  };
  appointmentDetails: {
    appointmentDateValue: {
      startDate: DateType;
      endDate: DateType;
    };
    appointmentTime: string;
    appointmentReason?: EnumAppointmentReason;
    appointmentStatus: EnumAppointmentStatus;
  };
}

export interface IEmergencyModal {
  showEmergencyModal: boolean;
  refetchEmergency: boolean;
  emergencyDetails: IEmergencyDetails;
}
export interface IEmergencyDetails {
  emergencyLocation: string;
  emergencySubject: string;
  emergencyMessage?: string;
}

export interface IGetEmergencyResponse {
  created_date: string;
  location: string;
  message?: string;
  sender_email?: string;
  subject: string;
}

export interface IViewEmergencyModal {
  showViewEmergencyModal: boolean;
  viewEmergencyDetails: IGetEmergencyResponse;
}

export interface IDrawer {
  showDrawer: boolean;
}

export interface INewsUpdates {
  id: any;
  image: any;
  headline: string;
  fb_link: string;
}

export interface INewsModal {
  refetchNews: boolean;
  newsModalType: EnumNewsModalType;
  showNewsConfirmationModal: boolean;
  showNewsModal: boolean;
  newsDetails: INewsUpdates;
}

export interface IAppointment {
  id: number;
  name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_reason: string;
  appointment_status: EnumAppointmentStatus;
}

export interface ISelectedAppointmentRows {
  selectedRows?: IAppointment[];
}

export interface ILogout {
  isLoadingLogout: boolean;
}

export interface IDoctor {
  id: any;
  image: any;
  name: string;
  position: string;
  specialty: string;
  status: EnumDoctorStatus;
}

export interface IDoctorModal {
  doctorModalType: EnumDoctorModalType;
  refetchDoctor?: boolean;
  showDoctorModal: boolean;
  showConfirmationModal: boolean;
  doctorDetails: IDoctor;
}

export interface IMedicineModal {
  refetchMedicine: boolean;
  medicineModalType?: EnumMedicineModalType;
  showMedicineModal: boolean;
  showMedicineConfirmationModal: boolean;
  medicineDetails: IMedicine;
}


export interface IMedicineQuantityModal {
  refetchMedicine: boolean;
  medicineQuantityModalType?: EnumMedicineQuantityModalType;
  editQuantity: number;
  medicineDetails: IMedicine;
  showMedicineQuantityModal: boolean;
}

export interface IMedicine {
  id: any;
  image: any;
  medicine: string;
  dosage: string;
  type: string;
  quantity: number;
}

export interface IUserRecordTable {
  user_id: any;
  date: string;
  illness_history: string;
  physical_exam: string;
  assessment: string;
  treatment_plan: string;
  notes: string;
}

export interface IRecordsModal {
  refetchRecords?: boolean;
  showRecordsModal: boolean;
  userRecord: IUserRecordTable;
}

export interface IRegistration {
  refetchPatients?: boolean;
  registrationDetails: {
    first_name: string;
    last_name: string;
    birthday: string;
    contact: string;
    address: string;
    sex: EnumGender;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
}

export interface IGlobalLoading {
  globalLoading: boolean;
}

export interface IUserSettings {
  refetchUser?: boolean;
  userSettingsDetails: {
    user_id: any;
    first_name: string;
    last_name: string;
    birthday: string;
    contact: string;
    address: string;
    sex: EnumGender;
    email: string;
    username: string;
    role: EnumUserRole;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
}

export interface IRoot {
  authModal: IAuthModal;
  userAuth: IUserAuth;
  drawer: IDrawer;
  emergencyModal: IEmergencyModal;
  appointmentModal: IAppointmentRequestModal;
  doctorModal: IDoctorModal;
  medicineModal: IMedicineModal;
  userDetails: IUserDetails;
  editUserDetail: IEditUserDetails;
  alertMessage: IAlertMessage;
  newsModal: INewsModal;
  logout: ILogout;
  registration: IRegistration;
  userSettings: IUserSettings;
  recordsModal: IRecordsModal;
  viewEmergencyModal: IViewEmergencyModal;
  globalLoading: IGlobalLoading;
  medicineQuantityModal: IMedicineQuantityModal;
}
