import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { User, AreaOfStudy, Lecture, Article, Testimonial, Enrollment, ContactMessage, Supervisor, Teacher, Package, Subscription, Settings as AppSettings } from '../types';

export interface Notification {
  _id?: string;
  id?: string;
  userId: string | 'admin';
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: 'info' | 'success' | 'warning' | 'error';
  status: 'unread' | 'read';
  createdAt: string;
  link?: string;
}

interface DataContextType {
  lectures: Lecture[];
  articles: Article[];
  areasOfStudy: AreaOfStudy[];
  testimonials: Testimonial[];
  settings: AppSettings;
  enrollments: Enrollment[];
  contactMessages: ContactMessage[];
  users: User[];
  supervisors: Supervisor[];
  teachers: Teacher[];
  packages: Package[];
  subscriptions: Subscription[];
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  
  setLectures: (d: Lecture[]) => void;
  setArticles: (d: Article[]) => void;
  setAreasOfStudy: (d: AreaOfStudy[]) => void;
  setTestimonials: (d: Testimonial[]) => void;
  updateSettings: (d: AppSettings) => Promise<void>;
  setEnrollments: (d: Enrollment[]) => void;
  setContactMessages: (d: ContactMessage[]) => void;
  setUsers: (d: User[]) => void;
  setSupervisors: (d: Supervisor[]) => void;
  setTeachers: (d: Teacher[]) => void;
  setPackages: (d: Package[]) => void;
  setSubscriptions: (d: Subscription[]) => void;
  
  addLecture: (l: Partial<Lecture>) => Promise<boolean>;
  updateLecture: (id: string, d: Partial<Lecture>) => Promise<boolean>;
  deleteLecture: (id: string) => Promise<boolean>;
  addArticle: (a: Partial<Article>) => Promise<boolean>;
  updateArticle: (id: string, d: Partial<Article>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  addTestimonial: (t: Partial<Testimonial>) => Promise<boolean>;
  updateTestimonial: (id: string, d: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  addContactMessage: (m: Partial<ContactMessage>) => Promise<boolean>;
  updateContactMessage: (id: string, d: Partial<ContactMessage>) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  addEnrollment: (e: Partial<Enrollment>) => Promise<boolean>;
  updateEnrollment: (id: string, d: Partial<Enrollment>) => Promise<boolean>;
  deleteEnrollment: (id: string) => Promise<boolean>;
  updateUser: (id: string, d: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  addSupervisor: (s: Partial<Supervisor>) => Promise<boolean>;
  updateSupervisor: (id: string, d: Partial<Supervisor>) => Promise<boolean>;
  deleteSupervisor: (id: string) => Promise<boolean>;
  addTeacher: (t: Partial<Teacher>) => Promise<boolean>;
  updateTeacher: (id: string, d: Partial<Teacher>) => Promise<boolean>;
  deleteTeacher: (id: string) => Promise<boolean>;
  addPackage: (p: Partial<Package>) => Promise<boolean>;
  updatePackage: (id: string, d: Partial<Package>) => Promise<boolean>;
  deletePackage: (id: string) => Promise<boolean>;
  addSubscription: (s: Partial<Subscription>) => Promise<boolean>;
  updateSubscription: (id: string, d: Partial<Subscription>) => Promise<boolean>;
  deleteSubscription: (id: string) => Promise<boolean>;
  addAreaOfStudy: (a: Partial<AreaOfStudy>) => Promise<boolean>;
  updateAreaOfStudy: (id: string, d: Partial<AreaOfStudy>) => Promise<boolean>;
  deleteAreaOfStudy: (id: string) => Promise<boolean>;
  
  getFeaturedLectures: () => Lecture[];
  getPublishedArticles: () => Article[];
  getPublishedTestimonials: () => Testimonial[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: (userId: string | 'admin') => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

// Helper to normalize _id to id for frontend compatibility
const normId = (arr: any[]) => arr.map(item => ({ ...item, id: item._id || item.id }));

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [lectures, setLecturesState] = useState<Lecture[]>([]);
  const [articles, setArticlesState] = useState<Article[]>([]);
  const [areasOfStudy, setAreasState] = useState<AreaOfStudy[]>([]);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>({});
  const [enrollments, setEnrollmentsState] = useState<Enrollment[]>([]);
  const [contactMessages, setContactState] = useState<ContactMessage[]>([]);
  const [users, setUsersState] = useState<User[]>([]);
  const [supervisors, setSupervisorsState] = useState<Supervisor[]>([]);
  const [teachers, setTeachersState] = useState<Teacher[]>([]);
  const [packages, setPackagesState] = useState<Package[]>([]);
  const [subscriptions, setSubscriptionsState] = useState<Subscription[]>([]);
  const [notifications, setNotificationsState] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    try { return localStorage.getItem('sa_token') || ''; } catch { return ''; }
  };

  const fetchApi = async (url: string, method = 'GET', body?: any) => {
    const token = getToken();
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options: any = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    let API_URL = import.meta.env.VITE_API_URL || '';
    if (API_URL.endsWith('/api')) API_URL = API_URL.slice(0, -4);
    if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
    if (API_URL.endsWith('/api')) {
      API_URL = API_URL.slice(0, -4);
    }
    const res = await fetch(`${API_URL}/api${url}`, options);
    if (!res.ok) {
        if(res.status === 401 || res.status === 403) return null; // Ignore auth errors for public viewing
        throw new Error(`API Error: ${res.statusText}`);
    }
    return res.json();
  };

  const refreshData = useCallback(async () => {
    setLoading(true);

    const fetchAndSet = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any>>, isObj = false) => {
      try {
        const res = await fetchApi(endpoint);
        if (res) setter(isObj ? res : normId(res));
      } catch {
        // Ignore errors, keep defaults
      }
    };

    // Build array of fetch tasks
    const fetchTasks = [
      () => fetchAndSet('/lectures', setLecturesState),
      () => fetchAndSet('/articles', setArticlesState),
      () => fetchAndSet('/areas', setAreasState),
      () => fetchAndSet('/testimonials', setTestimonialsState),
      () => fetchAndSet('/settings', setSettingsState, true),
      () => fetchAndSet('/packages', setPackagesState),
    ];

    if (currentUser) {
      fetchTasks.push(() => fetchAndSet('/notifications', setNotificationsState));
      if (currentUser.role === 'admin') {
        fetchTasks.push(() => fetchAndSet('/enrollments', setEnrollmentsState));
        fetchTasks.push(() => fetchAndSet('/contact', setContactState));
        fetchTasks.push(() => fetchAndSet('/users', setUsersState));
        fetchTasks.push(() => fetchAndSet('/supervisors', setSupervisorsState));
        fetchTasks.push(() => fetchAndSet('/teachers', setTeachersState));
        fetchTasks.push(() => fetchAndSet('/subscriptions', setSubscriptionsState));
      } else {
        fetchTasks.push(() => fetchAndSet('/enrollments/my', setEnrollmentsState));
      }
    }

    // Process sequentially to completely bypass Render's strict HTTP/2 limit
    const processInBackground = async () => {
      for (const task of fetchTasks) {
        await task();
        // 50ms micro-pause to let the browser breathe and prevent stream clustering
        await new Promise(r => setTimeout(r, 50));
      }
      // Once all data has successfully streamed in, remove the beautiful Skeletons
      setLoading(false);
    };
    
    processInBackground();
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData, currentUser]);

  // Expose state setters for immediate UI updates if needed, though API calls will refresh
  const setLectures = setLecturesState;
  const setArticles = setArticlesState;
  const setAreasOfStudy = setAreasState;
  const setTestimonials = setTestimonialsState;
  const setEnrollments = setEnrollmentsState;
  const setContactMessages = setContactState;
  const setUsers = setUsersState;
  const setSupervisors = setSupervisorsState;
  const setTeachers = setTeachersState;
  const setPackages = setPackagesState;
  const setSubscriptions = setSubscriptionsState;

  // Settings
  const updateSettings = async (d: any) => {
    const updated = await fetchApi('/settings', 'PATCH', d);
    if(updated) setSettingsState(updated);
  };

  // Notifications
  const addNotification = async (n: Omit<Notification, 'id' | 'createdAt' | 'status'>) => {
    const created = await fetchApi('/notifications', 'POST', n);
    if(created) setNotificationsState(prev => [normId([created])[0], ...prev]);
  };
  const markNotificationAsRead = async (id: string) => {
    const updated = await fetchApi(`/notifications/${id}`, 'PATCH');
    if(updated) setNotificationsState(prev => prev.map(n => n.id === id || n._id === id ? normId([updated])[0] : n));
  };
  const clearAllNotifications = async (userId: string | 'admin') => {
    await fetchApi('/notifications/clear', 'DELETE');
    setNotificationsState(prev => prev.filter(n => n.userId !== userId));
  };

  // Generic CRUD helpers
  const createItem = async (endpoint: string, data: any, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    const created = await fetchApi(endpoint, 'POST', data);
    if(created) {
      setState(prev => [...prev, normId([created])[0]]);
      return true;
    }
    return false;
  };
  const updateItem = async (endpoint: string, id: string, data: any, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    const updated = await fetchApi(`${endpoint}/${id}`, 'PATCH', data);
    if(updated) {
      setState(prev => prev.map(item => item.id === id || item._id === id ? normId([updated])[0] : item));
      return true;
    }
    return false;
  };
  const deleteItem = async (endpoint: string, id: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    const res = await fetchApi(`${endpoint}/${id}`, 'DELETE');
    if(res) {
      setState(prev => prev.filter(item => item.id !== id && item._id !== id));
      return true;
    }
    return false;
  };

  // Lectures
  const addLecture = (l: any) => createItem('/lectures', l, setLecturesState);
  const updateLecture = (id: string, d: any) => updateItem('/lectures', id, d, setLecturesState);
  const deleteLecture = (id: string) => deleteItem('/lectures', id, setLecturesState);

  // Articles
  const addArticle = (a: any) => createItem('/articles', a, setArticlesState);
  const updateArticle = (id: string, d: any) => updateItem('/articles', id, d, setArticlesState);
  const deleteArticle = (id: string) => deleteItem('/articles', id, setArticlesState);

  // Testimonials
  const addTestimonial = (t: any) => createItem('/testimonials', t, setTestimonialsState);
  const updateTestimonial = (id: string, d: any) => updateItem('/testimonials', id, d, setTestimonialsState);
  const deleteTestimonial = (id: string) => deleteItem('/testimonials', id, setTestimonialsState);

  // Contact
  const addContactMessage = async (m: any) => {
      const res = await fetchApi('/contact', 'POST', m);
      if (res) refreshData();
      return !!res;
  };
  const updateContactMessage = (id: string, d: any) => updateItem('/contact', id, d, setContactState);
  const deleteContactMessage = (id: string) => deleteItem('/contact', id, setContactState);

  // Enrollments
  const addEnrollment = async (e: any) => {
    const created = await fetchApi('/enrollments', 'POST', e);
    if(created) {
        setEnrollmentsState(prev => [...prev, normId([created])[0]]);
        refreshData(); // To fetch the updated list including notifications
        return true;
    }
    return false;
  };
  const updateEnrollment = (id: string, d: any) => updateItem('/enrollments', id, d, setEnrollmentsState);
  const deleteEnrollment = (id: string) => deleteItem('/enrollments', id, setEnrollmentsState);

  // Users
  const updateUser = (id: string, d: any) => updateItem('/users', id, d, setUsersState);
  const deleteUser = (id: string) => deleteItem('/users', id, setUsersState);

  // Supervisors
  const addSupervisor = (s: any) => createItem('/supervisors', s, setSupervisorsState);
  const updateSupervisor = (id: string, d: any) => updateItem('/supervisors', id, d, setSupervisorsState);
  const deleteSupervisor = (id: string) => deleteItem('/supervisors', id, setSupervisorsState);

  // Teachers
  const addTeacher = (t: any) => createItem('/teachers', t, setTeachersState);
  const updateTeacher = (id: string, d: any) => updateItem('/teachers', id, d, setTeachersState);
  const deleteTeacher = (id: string) => deleteItem('/teachers', id, setTeachersState);

  // Packages
  const addPackage = (p: any) => createItem('/packages', p, setPackagesState);
  const updatePackage = (id: string, d: any) => updateItem('/packages', id, d, setPackagesState);
  const deletePackage = (id: string) => deleteItem('/packages', id, setPackagesState);

  // Subscriptions
  const addSubscription = (s: any) => createItem('/subscriptions', s, setSubscriptionsState);
  const updateSubscription = (id: string, d: any) => updateItem('/subscriptions', id, d, setSubscriptionsState);
  const deleteSubscription = (id: string) => deleteItem('/subscriptions', id, setSubscriptionsState);

  // Areas of Study
  const addAreaOfStudy = (a: any) => createItem('/areas', a, setAreasState);
  const updateAreaOfStudy = (id: string, d: any) => updateItem('/areas', id, d, setAreasState);
  const deleteAreaOfStudy = (id: string) => deleteItem('/areas', id, setAreasState);

  // Selectors
  const getFeaturedLectures = useCallback(() => lectures.filter((l: any) => l.featured && l.status === 'published'), [lectures]);
  const getPublishedArticles = useCallback(() => articles.filter((a: any) => a.status === 'published'), [articles]);
  const getPublishedTestimonials = useCallback(() => testimonials.filter((t: any) => t.status === 'published'), [testimonials]);

  return (
    <DataContext.Provider value={{
      lectures, articles, areasOfStudy, testimonials, settings, enrollments, contactMessages, users,
      supervisors, teachers, packages, subscriptions, notifications, loading, refreshData,
      setLectures, setArticles, setAreasOfStudy, setTestimonials, updateSettings,
      setEnrollments, setContactMessages, setUsers, setSupervisors, setTeachers, setPackages, setSubscriptions,
      addLecture, updateLecture, deleteLecture,
      addArticle, updateArticle, deleteArticle,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addContactMessage, updateContactMessage, deleteContactMessage,
      addEnrollment, updateEnrollment, deleteEnrollment,
      updateUser, deleteUser,
      addSupervisor, updateSupervisor, deleteSupervisor,
      addTeacher, updateTeacher, deleteTeacher,
      addPackage, updatePackage, deletePackage,
      addSubscription, updateSubscription, deleteSubscription,
      addAreaOfStudy, updateAreaOfStudy, deleteAreaOfStudy,
      getFeaturedLectures, getPublishedArticles, getPublishedTestimonials,
      addNotification, markNotificationAsRead, clearAllNotifications,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);