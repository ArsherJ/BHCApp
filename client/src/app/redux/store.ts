"use client";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import {
  EnumAlerts,
  EnumAppointmentConfirmModal,
  EnumAppointmentReason,
  EnumAppointmentStatus,
  EnumAppointmentTime,
  EnumDoctorModalType,
  EnumDoctorStatus,
  EnumGender,
  EnumMedicineModalType,
  EnumMedicineQuantityModalType,
  EnumNewsModalType,
  EnumUserRole,
  IAlertMessage,
  IAppointment,
  IAppointmentRequestModal,
  IAuthModal,
  IDoctorModal,
  IDrawer,
  IEditUserDetails,
  IEmergencyModal,
  IMedicineModal,
  IMedicineQuantityModal,
  INewsModal,
  IRecordsModal,
  IRegistration,
  ISelectedAppointmentRows,
  IUserAuth,
  IUserDetails,
  IUserSettings,
  IViewEmergencyModal,
} from "./interfaces";
import dayjs from "dayjs";

// USERS

const initialAuthModalState: IAuthModal = {
  showModal: false,
};

const initialAppointmentModalState: IAppointmentRequestModal = {
  refetchAppointment: false, // for refetching appointments on appointment updates
  showAppointmentModal: false,
  showConfirmationModal: false,
  selectedAppointmentRows: undefined,
  confirmModalType: EnumAppointmentConfirmModal.ACCEPT,
  appointmentConfirmationDetails: {
    id: undefined,
    name: "",
    appointment_date: "",
    appointment_time: "",
    appointment_reason: "",
    appointment_status: EnumAppointmentStatus.PENDING,
  },
  appointmentDetails: {
    appointmentDateValue: {
      startDate: dayjs().format("YYYY/MM/DD").toString(),
      endDate: dayjs().format("YYYY/MM/DD").toString(),
    },
    appointmentTime: EnumAppointmentTime["8:00 AM"],
    appointmentReason: EnumAppointmentReason.CHECKUP,
    appointmentStatus: EnumAppointmentStatus.PENDING,
  },
};

const initialEmergencyModalState: IEmergencyModal = {
  refetchEmergency: false,
  showEmergencyModal: false,
  emergencyDetails: {
    emergencyLocation: "",
    emergencySubject: "MEDICAL EMERGENCY",
    emergencyMessage: "",
  },
};

const initialViewEmergencyModalState: IViewEmergencyModal = {
  showViewEmergencyModal: false,
  viewEmergencyDetails: {
    created_date: "",
    location: "",
    message: "",
    sender_email: "",
    subject: "",
  },
};

const initialDoctorModalState: IDoctorModal = {
  doctorModalType: EnumDoctorModalType.ADD,
  refetchDoctor: false,
  showDoctorModal: false,
  showConfirmationModal: false,
  doctorDetails: {
    id: undefined,
    image: "",
    name: "",
    position: "",
    specialty: "",
    status: EnumDoctorStatus.INACTIVE,
  },
};

const initialMedicineModalState: IMedicineModal = {
  refetchMedicine: false,
  medicineModalType: undefined,
  showMedicineModal: false,
  showMedicineConfirmationModal: false,
  medicineDetails: {
    id: null,
    image: null,
    medicine: "",
    dosage: "",
    type: "",
    quantity: 0,
  },
};

const initialMedicineQuantityModalState: IMedicineQuantityModal = {
  refetchMedicine: false,
  medicineQuantityModalType: undefined,
  showMedicineQuantityModal: false,
  editQuantity: 0,
  medicineDetails: {
    id: null,
    image: null,
    medicine: "",
    dosage: "",
    type: "",
    quantity: 0,
  },
};

const initialNewsModalState: INewsModal = {
  showNewsModal: false,
  showNewsConfirmationModal: false,
  newsModalType: EnumNewsModalType.ADD,
  refetchNews: false,
  newsDetails: {
    id: "",
    image: "",
    headline: "",
    fb_link: "",
  },
};

const initalDrawerState: IDrawer = {
  showDrawer: false,
};

const initialRegistrationDetails: IRegistration = {
  refetchPatients: false,
  registrationDetails: {
    first_name: "",
    last_name: "",
    birthday: "",
    contact: "",
    address: "",
    sex: EnumGender.MALE,
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  },
};

const initialUserSettingsDetails: IUserSettings = {
  refetchUser: false,
  userSettingsDetails: {
    user_id: "",
    first_name: "",
    last_name: "",
    birthday: "",
    contact: "",
    address: "",
    sex: EnumGender.MALE,
    email: "",
    role: EnumUserRole.USER,
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

const initialUserDetails: IUserDetails = {
  userDetails: {
    user_id: undefined,
    isAuth: false,
    first_name: "",
    last_name: "",
    birthday: "",
    contact: "",
    address: "",
    sex: "",
    email: "",
    username: "",
    role: "",
    records: {
      cesarean_section: "",
      philhealth_status: "",
      philhealth_id: "",
      head_of_the_family: "",
      covid_status: "",
      tobacco_use: "",
      blood_pressure: "",
      per_rectum: "",
      weight: undefined,
      height: undefined,
      bmi: undefined,
      temperature: undefined,
      pwd: "",
      senior: "",
      injury: "",
      mental_health: "",
    },
  },
};
const initialRecordsModalState: IRecordsModal = {
  refetchRecords: false,
  showRecordsModal: false,
  userRecord: {
    user_id: undefined,
    date: "",
    illness_history: "",
    physical_exam: "",
    assessment: "",
    treatment_plan: "",
    notes: "",
  },
};

const initialEditUserDetails: IEditUserDetails = {
  editUserDetails: {
    id: undefined,
    isAuth: false,
    first_name: "",
    last_name: "",
    birthday: "",
    contact: "",
    address: "",
    sex: "",
    email: "",
    username: "",
    role: "",
    cesarean_section: "",
    philhealth_status: "",
    philhealth_id: "",
    head_of_the_family: "",
    covid_status: "",
    tobacco_use: "",
    blood_pressure: "",
    per_rectum: "",
    weight: undefined,
    height: undefined,
    bmi: undefined,
    temperature: undefined,
    pwd: "",
    senior: "",
    injury: "",
    mental_health: "",
  },
  showDeleteUserModal: false,
};

const initialUserAuth: IUserAuth = {
  authValues: {
    username: "",
    password: "",
  },
};

const initialAlertState: IAlertMessage = {
  showAlert: false,
  alertDetails: {
    alertType: EnumAlerts.SUCCESS,
    alertMessage: "",
  },
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: initialUserDetails,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    clearUserDetails(state) {
      state.userDetails = {
        isAuth: false,
        user_id: "",
        first_name: "",
        last_name: "",
        birthday: "",
        contact: "",
        address: "",
        sex: "",
        email: "",
        username: "",
        role: "",
      };
    },
  },
});

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: initialUserAuth,
  reducers: {
    setAuthValues(state, action) {
      state.authValues = action.payload;
    },
  },
});

const drawerSlice = createSlice({
  name: "drawer",
  initialState: initalDrawerState,
  reducers: {
    toggleDrawer(state) {
      state.showDrawer = !state.showDrawer;
    },
  },
});

const authModalSlice = createSlice({
  name: "authModal",
  initialState: initialAuthModalState,
  reducers: {
    toggleAuthModal(state) {
      state.showModal = !state.showModal;
    },
  },
});

const appointmentModalSlice = createSlice({
  name: "appointmentModal",
  initialState: initialAppointmentModalState,
  reducers: {
    refetchAppointmentToggler(state) {
      state.refetchAppointment = !state.refetchAppointment;
    },
    toggleAppointmentModal(state) {
      state.showAppointmentModal = !state.showAppointmentModal;
    },
    toggleConfirmationModal(state) {
      state.showConfirmationModal = !state.showConfirmationModal;
    },
    setSelectedAppointmentRows(state, action) {
      state.selectedAppointmentRows = action.payload;
    },
    setAppointmentConfirmationDetails(state, action) {
      state.appointmentConfirmationDetails = action.payload;
    },
    setConfirmModalType(state, action) {
      state.confirmModalType = action.payload;
    },
    setAppointmentDetails(state, action) {
      state.appointmentDetails = action.payload;
    },
    clearAppointmentDetails(state) {
      state.appointmentDetails.appointmentDateValue.startDate = dayjs()
        .format("YYYY/MM/DD")
        .toString();
      state.appointmentDetails.appointmentDateValue.endDate = dayjs()
        .format("YYYY/MM/DD")
        .toString();
      state.appointmentDetails.appointmentTime = EnumAppointmentTime["8:00 AM"];
      state.appointmentDetails.appointmentReason =
        EnumAppointmentReason.CHECKUP;
    },
  },
});

const emergencyModalSlice = createSlice({
  name: "emergencyModal",
  initialState: initialEmergencyModalState,
  reducers: {
    toggleEmergencyModal(state) {
      state.showEmergencyModal = !state.showEmergencyModal;
    },
    refetchEmergencyToggler(state) {
      state.refetchEmergency = !state.refetchEmergency;
    },
    setEmergencyDetails(state, action) {
      state.emergencyDetails = action.payload;
    },
    clearEmergencyDetails(state) {
      state.emergencyDetails = {
        emergencyLocation: "",
        emergencySubject: "MEDICAL EMERGENCY",
        emergencyMessage: "",
      };
    },
  },
});

const viewEmergencyModalSlice = createSlice({
  name: "viewEmergencyModal",
  initialState: initialViewEmergencyModalState,
  reducers: {
    toggleViewEmergencyModal(state) {
      state.showViewEmergencyModal = !state.showViewEmergencyModal;
    },
    setEmergencyDetails(state, action) {
      state.viewEmergencyDetails = action.payload;
    },
  },
});

const doctorModalSlice = createSlice({
  name: "doctorModal",
  initialState: initialDoctorModalState,
  reducers: {
    toggleDoctorModal(state) {
      state.showDoctorModal = !state.showDoctorModal;
    },
    setDoctorModalType(state, action) {
      state.doctorModalType = action.payload;
    },
    refetchDoctorsToggler(state) {
      state.refetchDoctor = !state.refetchDoctor;
    },
    toggleConfirmationModal(state) {
      state.showConfirmationModal = !state.showConfirmationModal;
    },
    setDoctorDetails(state, action) {
      state.doctorDetails = action.payload;
    },
    clearDoctorDetails(state) {
      state.doctorDetails = {
        id: undefined,
        image: "",
        name: "",
        position: "",
        specialty: "",
        status: EnumDoctorStatus.INACTIVE,
      };
    },
  },
});

const medicineModalSlice = createSlice({
  name: "medicineModal",
  initialState: initialMedicineModalState,
  reducers: {
    toggleMedicineModal(state) {
      state.showMedicineModal = !state.showMedicineModal;
    },
    setMedicineModalType(state, action) {
      state.medicineModalType = action.payload;
    },
    refetchMedicineToggler(state) {
      state.refetchMedicine = !state.refetchMedicine;
    },
    toggleMedicineConfirmationModal(state) {
      state.showMedicineConfirmationModal =
        !state.showMedicineConfirmationModal;
    },
    setMedicineDetails(state, action) {
      state.medicineDetails = action.payload;
    },
    clearMedicineDetails(state) {
      state.medicineDetails = {
        id: null,
        image: null,
        medicine: "",
        dosage: "",
        type: "",
        quantity: 0,
      };
    },
  },
});

const medicineQuantityModalSlice = createSlice({
  name: "medicineQuantityModal",
  initialState: initialMedicineQuantityModalState,
  reducers: {
    toggleMedicineQuantityModal(state) {
      state.showMedicineQuantityModal = !state.showMedicineQuantityModal;
    },
    setMedicineQuantityModalType(state, action) {
      state.medicineQuantityModalType = action.payload;
    },
    refetchMedicineToggler(state) {
      state.refetchMedicine = !state.refetchMedicine;
    },
    setEditQuantity(state, action) {
      state.editQuantity = action.payload;
    },
    setMedicineDetails(state, action) {
      state.medicineDetails = action.payload;
    },
    clearMedicineDetails(state) {
      state.medicineDetails = {
        id: null,
        image: null,
        medicine: "",
        dosage: "",
        type: "",
        quantity: 0,
      };
    },
  },
});

const editUserDetailSlice = createSlice({
  name: "editUserDetail",
  initialState: initialEditUserDetails,
  reducers: {
    setEditUserDetails(state, action) {
      state.editUserDetails = action.payload;
    },
    toggleDeleteUserModal(state){
      state.showDeleteUserModal = !state.showDeleteUserModal
    }
  },
});

const alertMessageSlice = createSlice({
  name: "alertMessage",
  initialState: initialAlertState,
  reducers: {
    setShowAlert(state, action) {
      state.showAlert = action.payload;
    },
    setAlertDetails(state, action) {
      state.alertDetails = action.payload;
    },
  },
});

const newsModalSlice = createSlice({
  name: "newsModal",
  initialState: initialNewsModalState,
  reducers: {
    toggleNewsModal(state) {
      state.showNewsModal = !state.showNewsModal;
    },
    toggleNewsConfirmationModal(state) {
      state.showNewsConfirmationModal = !state.showNewsConfirmationModal;
    },
    refetchNewsToggler(state) {
      state.refetchNews = !state.refetchNews;
    },
    setNewsModalType(state, action) {
      state.newsModalType = action.payload;
    },
    setNewsDetails(state, action) {
      state.newsDetails = action.payload;
    },
    clearNewsDetails(state) {
      state.newsDetails = {
        id: "",
        image: "",
        headline: "",
        fb_link: "",
      };
    },
  },
});

const recordsModalSlice = createSlice({
  name: "recordsModal",
  initialState: initialRecordsModalState,
  reducers: {
    toggleRecordsModal(state) {
      state.showRecordsModal = !state.showRecordsModal;
    },
    refetchRecordsToggler(state) {
      state.refetchRecords = !state.refetchRecords;
    },
    setUserRecord(state, action) {
      state.userRecord = action.payload;
    },
    clearUserRecords(state) {
      state.userRecord = {
        user_id: undefined,
        date: "",
        illness_history: "",
        physical_exam: "",
        assessment: "",
        treatment_plan: "",
        notes: "",
      };
    },
  },
});

const logoutSlice = createSlice({
  name: "logout",
  initialState: { isLoadingLogout: false },
  reducers: {
    setIsLoadingLogout(state, action) {
      state.isLoadingLogout = action.payload;
    },
  },
});

const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState: { globalLoading: false },
  reducers: {
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: initialUserSettingsDetails,
  reducers: {
    setUserSettingsDetails(state, action) {
      state.userSettingsDetails = action.payload;
    },
    refetchUserToggler(state) {
      state.refetchUser = !state.refetchUser;
    },
    clearUserSettingsDetails(state) {
      state.userSettingsDetails = {
        user_id: "",
        first_name: "",
        last_name: "",
        birthday: "",
        contact: "",
        address: "",
        sex: EnumGender.MALE,
        email: "",
        role: EnumUserRole.USER,
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    },
    clearUserChangePasswordInputs(state) {
      state.userSettingsDetails = {
        ...state.userSettingsDetails,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    },
  },
});

const registrationSlice = createSlice({
  name: "registration",
  initialState: initialRegistrationDetails,
  reducers: {
    setRegistrationDetails(state, action) {
      state.registrationDetails = action.payload;
    },
    refetchPatientsToggler(state) {
      state.refetchPatients = !state.refetchPatients;
    },
    clearRegistrationDetails(state) {
      state.registrationDetails = {
        first_name: "",
        last_name: "",
        birthday: "",
        contact: "",
        address: "",
        sex: EnumGender.MALE,
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      };
    },
  },
});
const store = configureStore({
  reducer: {
    authModal: authModalSlice.reducer,
    userAuth: userAuthSlice.reducer,
    drawer: drawerSlice.reducer,
    emergencyModal: emergencyModalSlice.reducer,
    appointmentModal: appointmentModalSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    editUserDetail: editUserDetailSlice.reducer,
    alertMessage: alertMessageSlice.reducer,
    logout: logoutSlice.reducer,
    registration: registrationSlice.reducer,
    userSettings: userSettingsSlice.reducer,
    doctorModal: doctorModalSlice.reducer,
    recordsModal: recordsModalSlice.reducer,
    medicineModal: medicineModalSlice.reducer,
    medicineQuantityModal: medicineQuantityModalSlice.reducer,
    newsModal: newsModalSlice.reducer,
    viewEmergencyModal: viewEmergencyModalSlice.reducer,
    globalLoading: globalLoadingSlice.reducer,
  },
});

export const authModalActions = authModalSlice.actions;
export const userAuthActions = userAuthSlice.actions;
export const drawerActions = drawerSlice.actions;
export const emergencyModalActions = emergencyModalSlice.actions;
export const appointmentModalActions = appointmentModalSlice.actions;
export const userDetailsActions = userDetailsSlice.actions;
export const editUserDetailActions = editUserDetailSlice.actions;
export const alertMessageActions = alertMessageSlice.actions;
export const logoutActions = logoutSlice.actions;
export const doctorModalActions = doctorModalSlice.actions;
export const recordsModalActions = recordsModalSlice.actions;
export const medicineModalActions = medicineModalSlice.actions;
export const medicineQuantityModalActions = medicineQuantityModalSlice.actions;
export const newsModalActions = newsModalSlice.actions;
export const viewEmergencyModalActions = viewEmergencyModalSlice.actions;
export const registrationActions = registrationSlice.actions;
export const userSettingsActions = userSettingsSlice.actions;
export const globalLoadingActions = globalLoadingSlice.actions;

export default store;
