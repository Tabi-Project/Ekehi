import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

document.getElementById("preview-dropdown").appendChild(
  Dropdown.create({
    label: "Business sector",
    options: [
      { value: "fintech", label: "Fintech" },
      { value: "health", label: "Health & Wellness" },
      { value: "retail", label: "Retail" },
    ],
  }),
);

document
  .getElementById("preview-searchbar")
  .appendChild(
    SearchBar.create({ placeholder: "Search 30+ funding opportunities" }),
  );
