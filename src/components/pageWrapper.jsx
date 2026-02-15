// // src/components/PageWrapper.jsx
// import { useEffect } from "react";

// const PageWrapper = ({ children }) => {
//   useEffect(() => {
//     window.scrollTo(0, 0); // optional but recommended
//   }, []);

//   return (
//     <div className="page-transition">
//       {children}
//     </div>
//   );
// };

// export default PageWrapper;





// src/components/PageWrapper.jsx
import { useEffect } from "react";

const PageWrapper = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // optional but recommended
  }, []);

  return (
    <div className="page-transition">
      {children}
    </div>
  );
};

export default PageWrapper;
