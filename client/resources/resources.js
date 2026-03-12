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
