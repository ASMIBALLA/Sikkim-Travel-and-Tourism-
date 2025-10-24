"use client";

import React, { useEffect, useState } from "react";
import InteractiveMap from "./interactive-map";

export default function InteractiveMapWrapper() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <InteractiveMap height="80vh" />;
}
