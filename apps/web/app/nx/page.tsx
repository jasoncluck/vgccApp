import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faHouse } from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "app/theme";
import { Video } from "app/video";
import { Suspense } from "react";

library.add(faHouse, faHeart);

export default function Page() {
  return (
    <section>
      <h1 className="text-center text-7xl text-green-500"> Hello!</h1>
      <button className="btn btn-primary"> my button</button>
      <p className="text-purple-400">
        hello <FontAwesomeIcon icon={"house"} />
        <ThemeSwitch />
        <Suspense fallback={<h1> Loading </h1>}>
          <Video />
        </Suspense>
      </p>
    </section>
  );
}
