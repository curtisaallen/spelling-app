import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue,
} from "firebase/firestore";

const db = getFirestore();

export type UserList = {
  id: string;
  name: string;
  words: string[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

// The Firestore document shape (without the id)
type UserListDoc = {
  name: string;
  words: string[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

// Collection reference for the current user
function listsCol(uid: string) {
  return collection(db, "users", uid, "lists");
}

// Convert a Firestore doc to our UserList type
function fromSnap(d: QueryDocumentSnapshot<DocumentData>): UserList {
  const data = d.data() as UserListDoc;
  return {
    id: d.id,
    name: String(data.name ?? ""),
    words: Array.isArray(data.words) ? (data.words as string[]) : [],
    createdAt: (data.createdAt ?? null) as Timestamp | null,
    updatedAt: (data.updatedAt ?? null) as Timestamp | null,
  };
}

export async function addUserList(
  uid: string,
  name: string,
  words: string[]
): Promise<string> {
  const payload: Omit<UserListDoc, "createdAt" | "updatedAt"> & {
    createdAt: FieldValue;
    updatedAt: FieldValue;
  } = {
    name,
    words,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(listsCol(uid), payload);
  return ref.id;
}

export async function updateUserList(
  uid: string,
  id: string,
  data: Partial<Pick<UserList, "name" | "words">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid, "lists", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserList(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "lists", id));
}

export async function fetchUserLists(uid: string): Promise<UserList[]> {
  const snap = await getDocs(query(listsCol(uid), orderBy("createdAt", "asc")));
  return snap.docs.map(fromSnap);
}

// Live updates (optional)
export function watchUserLists(
  uid: string,
  cb: (lists: UserList[]) => void
) {
  return onSnapshot(query(listsCol(uid), orderBy("createdAt", "asc")), (snap) => {
    cb(snap.docs.map(fromSnap));
  });
}
