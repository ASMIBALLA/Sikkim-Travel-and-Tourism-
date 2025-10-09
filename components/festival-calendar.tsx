"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Download, Calendar, MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx";


interface Festival {
  id: number
  name: string
  startDate: string
  endDate?: string
  location: string
  type: "religious" | "cultural" | "music"
  description: string
  img?: string
}

// Hardcoded festival data
const festivals: Festival[] = [
  {
    id: 1,
    name: "Losar Festival",
    startDate: "2025-02-08",
    endDate: "2025-02-10",
    location: "Gangtok",
    description: "Tibetan New Year celebrated with prayer dances and local feasts.",
    type: "religious",
    img: "/tibetan-new-year-celebration-with-colorful-prayer-.jpg",
  },
  {
    id: 2,
    name: "Sikkim International Flower Festival",
    startDate: "2025-03-10",
    endDate: "2025-03-15",
    location: "Gangtok",
    description: "Showcases Sikkim's rich biodiversity, floriculture and cultural programs.",
    type: "cultural",
    img: "/beautiful-flower-festival-with-rhododendrons-and-o.jpg",
  },
  {
    id: 3,
    name: "Pang Lhabsol",
    startDate: "2025-09-15",
    location: "Pelling",
    description: "Honoring Mount Kanchenjunga with rituals and mask dances.",
    type: "religious",
    img: "/traditional-mask-dance-ceremony-in-mountains.jpg",
  },
  {
    id: 4,
    name: "Sikkim Music Festival",
    startDate: "2025-06-20",
    endDate: "2025-06-22",
    location: "Gangtok",
    description: "Celebration of local and international music performances.",
    type: "music",
    img: "/music-festival-stage-with-mountain-backdrop.jpg",
  },
  {
    id: 5,
    name: "Bumchu Festival",
    startDate: "2025-01-15",
    location: "Tashiding",
    description: "Sacred water ceremony at Tashiding Monastery.",
    type: "religious",
    img: "/sacred-water-ceremony-at-buddhist-monastery.jpg",
  },
  {
    id: 6,
    name: "Saga Dawa",
    startDate: "2025-05-12",
    endDate: "2025-05-14",
    location: "Gangtok",
    description: "Celebrates Buddha's birth, enlightenment, and death.",
    type: "religious",
    img: "/buddhist-celebration-with-prayer-wheels-and-monks.jpg",
  },
  {
    id: 7,
    name: "Teej Festival",
    startDate: "2025-08-20",
    location: "Namchi",
    description: "Hindu festival celebrating the monsoon season.",
    type: "cultural",
    img: "/hindu-festival-celebration-with-traditional-dances.jpg",
  },
  {
    id: 8,
    name: "Drupka Teshi",
    startDate: "2025-07-28",
    location: "Rumtek",
    description: "Celebrates Buddha's first sermon.",
    type: "religious",
    img: "/buddhist-monastery-celebration-with-prayer-flags.jpg",
  },
]

const typeColors = {
  religious: "bg-red-500",
  cultural: "bg-green-500",
  music: "bg-blue-500",
}

const typeLabels = {
  religious: "religious",
  cultural: "cultural",
  music: "music",
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function FestivalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [dynamicFestivals, setDynamicFestivals] = useState<Festival[]>([])

  const today = new Date()


  useEffect(() => {
    const loadFestivalsFromXLSX = async () => {
      try {
        // Adjust filename if needed
        const response = await fetch("/sikkim_festivals_full.xlsx");
        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const cleanDate = (d: string) => d.split(' ')[0] || d;


        const festivalsFromExcel = jsonData.map((f: any, idx: number) => ({
          id: f["id"] || f["ID"],
          name: f["name"] || f["Name"],
          startDate: (typeof f["startDate"] === "string"
            ? f["startDate"].trim().split(" ")[0]
            : f["startDate"]) || (typeof f["StartDate"] === "string"
            ? f["StartDate"].trim().split(" ")[0]
            : f["StartDate"]),
          endDate: (typeof f["endDate"] === "string"
            ? f["endDate"].trim().split(" ")[0]
            : f["endDate"]) || f["startDate"],
          location: f["location"] || f["Location"],
          type: (f["type"] || f["Type"] || "cultural").toString().toLowerCase(),
          description: f["description"] || f["Description"] || "",
          img: f["img"] || f["Img"],
        }));


        setDynamicFestivals(festivalsFromExcel);
      } catch (err) {
        console.error("Error loading XLSX:", err);
      }
    };

    loadFestivalsFromXLSX();
  }, [])


  // Merge hardcoded and dynamic festivals
  const allFestivals = useMemo(
    () => [...festivals, ...dynamicFestivals],
    [dynamicFestivals]
  )

  // Filter festivals based on search & type
  const filteredFestivals = useMemo(() => {
    return allFestivals.filter((festival) => {
      const matchesSearch =
        festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || festival.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter, allFestivals])

  // Get festivals for a specific date
  const getFestivalsForDate = (date: Date) => {
    return filteredFestivals.filter((festival) => {
      const startDate = new Date(festival.startDate)
      const endDate = festival.endDate ? new Date(festival.endDate) : startDate
      return date >= startDate && date <= endDate
    })
  }

  // Calendar logic
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const isToday = (date: Date) => date.toDateString() === today.toDateString()
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

  // Export to ICS
  const exportToICS = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sikkim Tourism//Festival Calendar//EN",
      ...filteredFestivals.flatMap((festival) => [
        "BEGIN:VEVENT",
        `UID:${festival.id}@sikkimtourism.com`,
        `DTSTART:${festival.startDate.replace(/-/g, "")}`,
        `DTEND:${(festival.endDate || festival.startDate).replace(/-/g, "")}`,
        `SUMMARY:${festival.name}`,
        `DESCRIPTION:${festival.description}`,
        `LOCATION:${festival.location}`,
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
    ].join("\n")

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sikkim-festivals.ics"
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4">Festival Calendar</h2>
        <p className="text-xl text-muted-foreground">
          Discover Sikkim's vibrant cultural celebrations throughout the year
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search festivals or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2">
          <Button variant={typeFilter === "all" ? "default" : "outline"} onClick={() => setTypeFilter("all")} size="sm">
            All
          </Button>
          {Object.entries(typeLabels).map(([type, label]) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              onClick={() => setTypeFilter(type)}
              size="sm"
              className="flex items-center gap-2"
            >
              <div className={cn("w-3 h-3 rounded-full", typeColors[type as keyof typeof typeColors])} />
              {label}
            </Button>
          ))}
        </div>

        {/* Export */}
        <Button onClick={exportToICS} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Calendar */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((date, index) => {
              const dayFestivals = getFestivalsForDate(date)
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "relative p-2 min-h-[80px] border rounded-lg cursor-pointer transition-all",
                    isCurrentMonthDay ? "bg-background" : "bg-muted/30",
                    isTodayDate && "ring-2 ring-primary",
                    dayFestivals.length > 0 && "hover:shadow-md",
                  )}
                  whileHover={{ scale: dayFestivals.length > 0 ? 1.02 : 1 }}
                  onClick={() => {
                    if (dayFestivals.length > 0) {
                      setSelectedDate(date)
                      setSelectedFestival(dayFestivals[0])
                    }
                  }}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      isCurrentMonthDay ? "text-foreground" : "text-muted-foreground",
                      isTodayDate && "text-primary font-bold",
                    )}
                  >
                    {date.getDate()}
                  </div>

                  {/* Festival indicators */}
                  {dayFestivals.length > 0 && (
                    <div className="space-y-1">
                      {dayFestivals.slice(0, 2).map((festival, idx) => (
                        <div key={festival.id} className={cn("h-1 rounded-full", typeColors[festival.type])} />
                      ))}
                      {dayFestivals.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayFestivals.length - 2} more</div>
                      )}
                    </div>
                  )}

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredDate?.toDateString() === date.toDateString() && dayFestivals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-popover border rounded-lg shadow-lg min-w-[200px]"
                      >
                        <div className="text-sm font-medium mb-1">
                          {dayFestivals.length} festival{dayFestivals.length > 1 ? "s" : ""}
                        </div>
                        {dayFestivals.map((festival) => (
                          <div key={festival.id} className="text-xs text-muted-foreground">
                            {festival.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Festival Detail Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFestival(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedFestival.img && (
                  <img
                    src={selectedFestival.img || "/placeholder.svg"}
                    alt={selectedFestival.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40"
                  onClick={() => setSelectedFestival(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedFestival.name}</h3>
                  <Badge className={cn("text-white", typeColors[selectedFestival.type])}>
                    {typeLabels[selectedFestival.type]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedFestival.startDate).toLocaleDateString()}
                      {selectedFestival.endDate && ` - ${new Date(selectedFestival.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedFestival.location}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{selectedFestival.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Festival Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(typeLabels).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded-full", typeColors[type as keyof typeof typeColors])} />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
