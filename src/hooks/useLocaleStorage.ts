'use client'
import { useEffect } from "react";
import { create } from "zustand"

const useLocaleStorage = (key: string, defaultValue: any) => {
  const getInitialValue = () => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  }
  const storage = create<{value:any, setValue: (value: any) => void}>((set) => ({
    value: getInitialValue(),
    setValue: (value: any) => set({ value }),
  }))
  useEffect(() => {
    const {setValue} = storage()
    const safeParse = (value: any) => {
      try {
        return JSON.parse(value)
      } catch (error) {
        return defaultValue
      }
    }
    window.addEventListener('storage', e => {
      if (e.key === key) {
        setValue(safeParse(e.newValue))
      }
    })
  }, [key, storage, defaultValue]);
  return storage
}
export default useLocaleStorage
// import { useState, useEffect, Dispatch, SetStateAction } from "react";

// export default function useLocaleStorage<T extends any = any>(key: string, defaultValue: T) {
//   const [value, setValue] = useState<T>(() => {
//     let currentValue;

//     try {
//       currentValue = JSON.parse(
//         localStorage.getItem(key) || String(defaultValue)
//       );
//     } catch (error) {
//       currentValue = defaultValue;
//     }

//     return currentValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [value, key]);

//   return [value, setValue] as const;
// };