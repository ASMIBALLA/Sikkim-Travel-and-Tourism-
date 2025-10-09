"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Play, Camera, Sparkles } from "lucide-react"
import { useState } from "react"

interface MonasteryCardProps {
  title: string
  location: string
  duration: string
  image: string
  tags: string[]
  description?: string
}

export function MonasteryCard({ title, location, duration, image, tags, description }: MonasteryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Map better images to the tours
  const getImageForTour = (title: string) => {
    if (title.includes("Rumtek")) {
      return "/beautiful-himalayan-monastery-with-golden-roofs-an.jpg"
    } else if (title.includes("Pemayangtse")) {
      return "/ancient-tibetan-monastery-interior-with-wooden-scu.jpg"
    } else if (title.includes("Tashiding")) {
      return "/colorful-tibetan-festival-with-monks-in-traditiona.jpg"
    }
    return image
  }

  return (
    <Card
      className="group overflow-hidden bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageForTour(title) || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Camera className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-secondary/90 text-white backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            360° Tour
          </Badge>
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in-up">
            <Button size="lg" className="bg-white/90 text-primary hover:bg-white shadow-lg">
              <Play className="w-5 h-5 mr-2" />
              Open Tour
            </Button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
        </div>

        {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}
