import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

import HorizontalScrollCarousel from "./HorizontalScrollCarousel";

const Carousel = () => {
  return (
    <div className=" carousel bg-transparent">
      <div className="flex h-30 items-center justify-center"></div>
      <HorizontalScrollCarousel />
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          <FontAwesomeIcon className="size-6 animate-bounce" icon={faCaretUp} />
        </span>
      </div>
    </div>
  );
};

export default Carousel;
