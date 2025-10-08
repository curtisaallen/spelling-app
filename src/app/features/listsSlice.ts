// features/listsSlice.ts
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { loadState, saveState } from "../lib/localStorage";

export type WordList = { id: string; name: string; words: string[] };
export type ListsState = { lists: WordList[]; activeListId: string };

export const defaultLists: WordList[] = [
  { id: "seed-first-words", name: "First Words", words: ["cat","bat","dad","man","sat","red","one","two","big","ball"] },
  { id: "seed-colors", name: "Colors", words: ["white","red","green","blue","black","orange","purple","pink","yellow","brown"] },
  { id: "seed-numbers", name: "Numbers (1–12)", words: ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"] },
  { id: "seed-human-body", name: "Human Body", words: ["head","neck","ears","eyes","mouth","nose","shoulders","legs","feet","hands"] },
  { id: "seed-school", name: "At School", words: ["school","classroom","teacher","pupil","pencil","pen","eraser","book","notebook","principal"] },
  { id: "seed-nature", name: "Nature", words: ["water","ocean","desert","forest","sky","trees","clouds","sun","rain","lake"] },
  { id: "seed-occupations", name: "Occupations", words: ["policeman","teacher","nurse","doctor","fireman","mailman","driver","pilot","actor","dancer"] },
  { id: "seed-days", name: "Days of the Week", words: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","yesterday","today","tomorrow"] },
  { id: "seed-transport", name: "Transportation", words: ["bus","car","airplane","train","boat","ship","taxi","subway","ambulance","bicycle"] },
  { id: "seed-food", name: "Food", words: ["potato","eggs","bread","milk","cheese","lemon","banana","ice cream","orange","apple"] },
  { id: "seed-furniture", name: "Furniture", words: ["chair","table","desk","sofa","bed","bench","bookshelf","closet","lamp","stool"] },
  { id: "seed-birthday", name: "Birthday", words: ["cake","party","gift","balloon","songs","candles","clown","cookie","wish","celebrate"] },
  { id: "seed-instruments", name: "Musical Instruments", words: ["drums","trumpet","guitar","flute","harp","piano","harmonica","saxophone","clarinet","xylophone"] },
  { id: "seed-winter", name: "Winter", words: ["snow","frost","scarf","skate","ski","icicle","blizzard","gloves","holiday","New Year"] },
  { id: "seed-sports", name: "Sports", words: ["football","soccer","baseball","volleyball","hockey","swimming","golf","tennis","lacrosse","basketball"] },
  { id: "seed-weather", name: "Weather", words: ["sunshine","clouds","rain","snow","hail","thunder","storm","fog","lightning","wind"] },
  { id: "seed-hygiene", name: "Hygiene", words: ["teeth","floss","dentist","brush","toothpaste","mouth","soap","wash","clean","smile"] },
  { id: "seed-insects", name: "Insects", words: ["ant","fly","ladybug","mantis","bee","moth","butterfly","beetle","grasshopper","dragonfly"] },
  { id: "seed-fruits", name: "Fruits", words: ["strawberry","cherry","kiwi","lemon","lime","apple","orange","banana","mango","pear"] },
  { id: "seed-vegetables", name: "Vegetables", words: ["corn","carrot","broccoli","peas","beans","spinach","pepper","cabbage","celery","squash"] },
  { id: "seed-computers", name: "Computers", words: ["keyboard","mouse","disk","website","internet","monitor","email","laptop","speaker","screen"] },
  { id: "seed-art", name: "Art", words: ["paint","brush","colors","easel","pastel","artist","clay","sketch","mural","sculpt"] },
  { id: "seed-summer", name: "Summer", words: ["pool","beach","swim","ocean","vacation","family","sunshine","sand","shorts","party"] },
  { id: "seed-planets", name: "Planets", words: ["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune","Moon"] },
  { id: "seed-shapes", name: "Shapes", words: ["circle","triangle","square","rectangle","pentagon","hexagon","octagon","rhombus","star","oval"] },
  { id: "seed-subjects", name: "School Subjects", words: ["reading","writing","math","spelling","science","music","art","history","technology","PE"] },
];

// ---------- helpers: compare seed vs user list ----------
function normName(s: string) {
  return s.trim().toLowerCase();
}
// compare arrays by value and order (change to set-compare if you don't care about order)
function sameWords(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].trim().toLowerCase() !== b[i].trim().toLowerCase()) return false;
  }
  return true;
}
function isSameList(a: WordList, b: WordList) {
  return normName(a.name) === normName(b.name) && sameWords(a.words, b.words);
}
// --------------------------------------------------------

function seededState(): ListsState {
  return { lists: defaultLists, activeListId: defaultLists[0]?.id ?? "" };
}

const persisted = loadState<{ lists?: ListsState }>()?.lists;
const initialState: ListsState = persisted ?? seededState();

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    /**
     * When a user signs in, merge seed lists + THEIR lists,
     * but drop any seed that already exists in their database.
     */
    replaceAllLists(state, action: PayloadAction<WordList[]>) {
      const userLists = action.payload ?? [];

      // remove seeds that are already present in user lists
      const seedsNotInUser = defaultLists.filter(
        (seed) => !userLists.some((u) => isSameList(u, seed))
      );

      state.lists = [...seedsNotInUser, ...userLists];

      // keep active if still present; otherwise first available
      if (!state.lists.find((l) => l.id === state.activeListId)) {
        state.activeListId = state.lists[0]?.id ?? "";
      }
      saveState({ lists: state });
    },

    /** Signed out → show only seeds again */
    clearAllLists(state) {
      const seeded = seededState();
      state.lists = seeded.lists;
      state.activeListId = seeded.activeListId;
      saveState({ lists: state });
    },

    setActiveList(state, action: PayloadAction<string>) {
      state.activeListId = action.payload;
      saveState({ lists: state });
    },

    addList: {
      prepare(name: string, words: string[]) {
        return { payload: { id: nanoid(), name, words } as WordList };
      },
      reducer(state, action: PayloadAction<WordList>) {
        state.lists.push(action.payload);
        state.activeListId = action.payload.id;
        saveState({ lists: state });
      },
    },

    updateList(state, action: PayloadAction<WordList>) {
      const i = state.lists.findIndex((l) => l.id === action.payload.id);
      if (i >= 0) state.lists[i] = action.payload;
      saveState({ lists: state });
    },

    removeList(state, action: PayloadAction<string>) {
      state.lists = state.lists.filter((l) => l.id !== action.payload);
      if (state.activeListId === action.payload) {
        state.activeListId = state.lists[0]?.id ?? "";
      }
      saveState({ lists: state });
    },

    importCSV(state, action: PayloadAction<{ name: string; csv: string }>) {
      const words = action.payload.csv
        .split(/[\n,;\t]/g)
        .map((w) => w.trim())
        .filter(Boolean);
      const list: WordList = { id: nanoid(), name: action.payload.name, words };
      state.lists.push(list);
      state.activeListId = list.id;
      saveState({ lists: state });
    },
  },
});

export const {
  replaceAllLists,
  clearAllLists,
  setActiveList,
  addList,
  updateList,
  removeList,
  importCSV,
} = listsSlice.actions;

export default listsSlice.reducer;
