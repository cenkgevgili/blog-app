// Mock Auth System (localStorage based)
// In production, replace with real OAuth providers

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "microsoft" | "x";
  createdAt: string;
}

interface RegisteredUser {
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEY = "blog-auth-user";
const REGISTERED_USERS_KEY = "blog-registered-users";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(REGISTERED_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRegisteredUser(user: RegisteredUser): void {
  if (typeof window === "undefined") return;
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function findRegisteredUser(email: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function logout(): void {
  setCurrentUser(null);
  window.location.reload();
}

// Login with email - validates against registered users
export function loginWithEmail(email: string, password: string): User {
  const registeredUser = findRegisteredUser(email);
  
  if (!registeredUser) {
    throw new Error("Bu email ile kayıtlı kullanıcı bulunamadı");
  }
  
  if (registeredUser.password !== password) {
    throw new Error("Şifre hatalı");
  }
  
  const user: User = {
    id: crypto.randomUUID(),
    name: registeredUser.name,
    email: registeredUser.email,
    provider: "email",
    createdAt: registeredUser.createdAt,
  };
  setCurrentUser(user);
  return user;
}

// Register with email - saves to registered users list
export function registerWithEmail(
  name: string,
  email: string,
  password: string
): User {
  // Check if email already exists
  const existingUser = findRegisteredUser(email);
  if (existingUser) {
    throw new Error("Bu email adresi zaten kayıtlı");
  }
  
  // Save to registered users
  const registeredUser: RegisteredUser = {
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  };
  saveRegisteredUser(registeredUser);
  
  // Create and set current user
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    provider: "email",
    createdAt: registeredUser.createdAt,
  };
  setCurrentUser(user);
  return user;
}

// Mock OAuth functions (in production, these would redirect to OAuth providers)
export function loginWithGoogle(): User {
  const user: User = {
    id: crypto.randomUUID(),
    name: "Google Kullanıcı",
    email: "user@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    provider: "google",
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(user);
  return user;
}

export function loginWithMicrosoft(): User {
  const user: User = {
    id: crypto.randomUUID(),
    name: "Microsoft Kullanıcı",
    email: "user@outlook.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft",
    provider: "microsoft",
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(user);
  return user;
}

export function loginWithX(): User {
  const user: User = {
    id: crypto.randomUUID(),
    name: "X Kullanıcı",
    email: "user@x.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
    provider: "x",
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(user);
  return user;
}
