import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; //Wdith of dorpdown menu (w-60)

    //calculate initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    //check if dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      //align dropdown to the right edge of button instead
      left = rect.right + window.scrollX - dropdownWidth;

      //if still off-screen, align to the right edge of viewport with some padding instead
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
 
    // endure dropdown doesn't go off the left edge of the viewport
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
