import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  lectures: any[];
  articles: any[];
  areasOfStudy: any[];
  testimonials: any[];
  settings: any;
  enrollments: any[];
  contactMessages: any[];
  users: any[];
  supervisors: any[];
  teachers: any[];
  packages: any[];
  subscriptions: any[];
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  
  setLectures: (d: any) => void;
  setArticles: (d: any) => void;
  setAreasOfStudy: (d: any) => void;
  setTestimonials: (d: any) => void;
  updateSettings: (d: any) => Promise<void>;
  setEnrollments: (d: any) => void;
  setContactMessages: (d: any) => void;
  setUsers: (d: any) => void;
  setSupervisors: (d: any) => void;
  setTeachers: (d: any) => void;
  setPackages: (d: any) => void;
  setSubscriptions: (d: any) => void;
  
  addLecture: (l: any) => Promise<void>;
  updateLecture: (id: string, d: any) => Promise<void>;
  deleteLecture: (id: string) => Promise<void>;
  addArticle: (a: any) => Promise<void>;
  updateArticle: (id: string, d: any) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addTestimonial: (t: any) => Promise<void>;
  updateTestimonial: (id: string, d: any) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addContactMessage: (m: any) => Promise<void>;
  updateContactMessage: (id: string, d: any) => Promise<void>;
  addEnrollment: (e: any) => Promise<void>;
  updateEnrollment: (id: string, d: any) => Promise<void>;
  updateUser: (id: string, d: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addSupervisor: (s: any) => Promise<void>;
  updateSupervisor: (id: string, d: any) => Promise<void>;
  deleteSupervisor: (id: string) => Promise<void>;
  addTeacher: (t: any) => Promise<void>;
  updateTeacher: (id: string, d: any) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  addPackage: (p: any) => Promise<void>;
  updatePackage: (id: string, d: any) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  addSubscription: (s: any) => Promise<void>;
  updateSubscription: (id: string, d: any) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  addAreaOfStudy: (a: any) => Promise<void>;
  updateAreaOfStudy: (id: string, d: any) => Promise<void>;
  deleteAreaOfStudy: (id: string) => Promise<void>;
  
  getFeaturedLectures: () => any[];
  getPublishedArticles: () => any[];
  getPublishedTestimonials: () => any[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: (userId: string | 'admin') => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

// Helper to normalize _id to id for frontend compatibility
const normId = (arr: any[]) => arr.map(item => ({ ...item, id: item._id || item.id }));

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [lectures, setLecturesState] = useState<any[]>([]);
  const [articles, setArticlesState] = useState<any[]>([]);
  const [areasOfStudy, setAreasState] = useState<any[]>([]);
  const [testimonials, setTestimonialsState] = useState<any[]>([]);
  const [settings, setSettingsState] = useState<any>({});
  const [enrollments, setEnrollmentsState] = useState<any[]>([]);
  const [contactMessages, setContactState] = useState<any[]>([]);
  const [users, setUsersState] = useState<any[]>([]);
  const [supervisors, setSupervisorsState] = useState<any[]>([]);
  const [teachers, setTeachersState] = useState<any[]>([]);
  const [packages, setPackagesState] = useState<any[]>([]);
  const [subscriptions, setSubscriptionsState] = useState<any[]>([]);
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

    // Fire all requests in parallel but update their state immediately upon resolution
    await Promise.allSettled([
      fetchAndSet('/lectures', setLecturesState),
      fetchAndSet('/articles', setArticlesState),
      fetchAndSet('/areas', setAreasState),
      fetchAndSet('/testimonials', setTestimonialsState),
      fetchAndSet('/settings', setSettingsState, true),
      fetchAndSet('/enrollments', setEnrollmentsState),
      fetchAndSet('/contact', setContactState),
      fetchAndSet('/users', setUsersState),
      fetchAndSet('/supervisors', setSupervisorsState),
      fetchAndSet('/teachers', setTeachersState),
      fetchAndSet('/packages', setPackagesState),
      fetchAndSet('/subscriptions', setSubscriptionsState),
      fetchAndSet('/notifications', setNotificationsState)
    ]);

    setLoading(false);
  }, []);

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
    if(created) setState(prev => [...prev, normId([created])[0]]);
  };
  const updateItem = async (endpoint: string, id: string, data: any, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    const updated = await fetchApi(`${endpoint}/${id}`, 'PATCH', data);
    if(updated) setState(prev => prev.map(item => item.id === id || item._id === id ? normId([updated])[0] : item));
  };
  const deleteItem = async (endpoint: string, id: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    await fetchApi(`${endpoint}/${id}`, 'DELETE');
    setState(prev => prev.filter(item => item.id !== id && item._id !== id));
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
      await fetchApi('/contact', 'POST', m);
      // Public form submission doesn't need to update state immediately unless we are admin viewing it
      // But we will fetch if admin. For now, just add to state if it works
      refreshData();
  };
  const updateContactMessage = (id: string, d: any) => updateItem('/contact', id, d, setContactState);

  // Enrollments
  const addEnrollment = async (e: any) => {
    const created = await fetchApi('/enrollments', 'POST', e);
    if(created) {
        setEnrollmentsState(prev => [...prev, normId([created])[0]]);
        refreshData(); // To fetch the updated list including notifications
    }
  };
  const updateEnrollment = (id: string, d: any) => updateItem('/enrollments', id, d, setEnrollmentsState);

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
      addContactMessage, updateContactMessage,
      addEnrollment, updateEnrollment,
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