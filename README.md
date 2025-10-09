# Sikkim Monastery 360

A feature-rich, interactive web platform for exploring Sikkim's monasteries, festivals, and travel options. This Next.js/React project enables users to discover cultural events, visualize monastery locations, and book travel with a modern, engaging UI.

---

## 🚀 Features

- **Interactive Festival Calendar**  
  View religious, cultural, and music festivals across Sikkim, filter by type, search by name/location, and export events to ICS calendar files.

- **Travel Booking System**  
  Users can search trips, select transport options, manage booking history, and confirm reservations.

- **Dynamic Festival Data**  
  Festivals are dynamically loaded from a Google Sheet CSV or Excel file, supporting easy yearly updates.

- **Monastery Map**  
  Explore monastery locations on a responsive map with modal info popups and location input integration.

- **Componentized Architecture**  
  Modular React components for maintainable development:
  - `FestivalCalendar`
  - `InteractiveMap`
  - `BookingHistory`
  - `Confirmation`
  - `LocationInput`
  - `MapModal`
  - `TransportOptions`

- **Custom Hooks & Styles**  
  Includes `useBookingState` for managing user trips, and tailored CSS for travel pages.

---

## 🛠️ Tech Stack

- **Frameworks:** Next.js 14+, React 18+
- **Styling:** Tailwind CSS
- **Data Handling:** XLSX (SheetJS) for Excel importing, dynamic API integration
- **State Management:** React hooks
- **Mapping:** Leaflet/Mapbox/Custom Solution
- **Version Control:** git + GitHub

---

## 📑 Installation

1. Clone the repository:
git clone https://github.com/YOUR-GITHUB-USERNAME/sikkim-monastery-360.git
cd sikkim-monastery

text

2. Install dependencies:
npm install

text

3. Set up festival data:
   - Place `sikkim_festivals_full.xlsx` (or your festival data file) into `/public`

4. Start the development server:
npm run dev

text

5. Access locally at [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

components/
festival-calendar.t
x interactive-map
tsx booking-histo
y.tsx confirma
ion.tsx location
input.tsx m
p-modal.tsx transpo
t-opti
ns.tsx hooks/ use-
ooking-
tate.ts styles/
trav
lglobal
.css ap

text

---

## 🖼️ Core Components Overview

- **FestivalCalendar:** Interactive calendar, data import, search/filter UI, event popups.
- **InteractiveMap:** Monastery map visualization with modal info cards.
- **BookingHistory & Confirmation:** Displays user booking history, confirms travel arrangements.
- **LocationInput & TransportOptions:** Smart input and selection for planning routes.
- **MapModal:** Full-screen map display for deep exploration.

---
## UI/UX
<img width="938" height="427" alt="image" src="https://github.com/user-attachments/assets/e95da65e-83df-419d-8e84-0a99b028a6c7" />
<img width="931" height="428" alt="image" src="https://github.com/user-attachments/assets/2f07d9c8-bf76-4e7e-acf6-c90f57c9e11c" />
<img width="538" height="362" alt="image" src="https://github.com/user-attachments/assets/2f07dff9-58c6-4879-aabe-7dea2a76ab63" />
<img width="925" height="422" alt="image" src="https://github.com/user-attachments/assets/8a327f81-3e99-4e7d-ae58-ea31315a0ad4" />






## 🗂️ Updating Festival/Event Data

Update festival information by replacing/updating `festivals.xlsx` file in the `public` directory. Supported data columns:
`id, name, startDate, endDate, location, description, type, img`

*Tip: For best results, ensure column headers are precise and date fields use ISO format.*

---

## 🌐 Deployment

To deploy, you can use platforms like Vercel or Netlify.  
Push your main branch to GitHub and configure deployment to auto-build on changes.

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo, create a feature branch, commit changes, and open a pull request.
- Use clear commit messages and test new components before submitting.

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for usage rights.

---

## 🙏 Acknowledgments

- SheetJS for Excel data import
- Sikkim Tourism for festival/event inspiration
- Open-source mapping tools and icon libraries

---

## 📧 Contact

For questions, suggestions, or partnership:
- [Your Name](mailto:your-email@example.com)
- [GitHub Issues](https://github.com/YOUR-GITHUB-USERNAME/sikkim-monastery-360/issues)

---

**This project celebrates Sikkim’s vibrant culture and enables seamless travel planning for all!**
