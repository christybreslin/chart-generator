"use client"

import { useEffect, useRef, useState } from "react"

interface DataPoint {
  date: string
  series1: number
  series2: number
}

export default function ChartGenerator() {
  const areaCanvasRef = useRef<HTMLCanvasElement>(null)
  const barCanvasRef = useRef<HTMLCanvasElement>(null)
  const [pastedData, setPastedData] = useState("")
  
  // Separate settings for each chart type
  const [areaSettings, setAreaSettings] = useState({
    series1Name: "Entry Queue",
    series2Name: "Exit Queue",
    series1Color: "#14b8a6",
    series2Color: "#ef4444",
    chartTitle: "Entry vs Exit Queue",
    yAxisLabel: "Eth Queued"
  })
  
  const [barSettings, setBarSettings] = useState({
    series1Name: "Entry Queue",
    series2Name: "Exit Queue", 
    series1Color: "#3b82f6",
    series2Color: "#f59e0b",
    chartTitle: "Entry vs Exit Queue",
    yAxisLabel: "Eth Queued"
  })
  
  const [parsedData, setParsedData] = useState<DataPoint[]>([])
  const [activeChartType, setActiveChartType] = useState<"area" | "bar">("area")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get current settings based on active chart type
  const currentSettings = activeChartType === "area" ? areaSettings : barSettings
  const setCurrentSettings = activeChartType === "area" ? setAreaSettings : setBarSettings

  // Default example data (exact same as crypto dashboard)
  const defaultData = [
    { date: "2025-01-01", series1: 68704, series2: 416 },
    { date: "2025-01-02", series1: 38080, series2: 448 },
    { date: "2025-01-03", series1: 2464, series2: 640 },
    { date: "2025-01-04", series1: 5888, series2: 128 },
    { date: "2025-01-05", series1: 256, series2: 544 },
    { date: "2025-01-06", series1: 14208, series2: 288 },
    { date: "2025-01-07", series1: 8800, series2: 28448 },
    { date: "2025-01-08", series1: 2112, series2: 136160 },
    { date: "2025-01-09", series1: 51840, series2: 42048 },
    { date: "2025-01-10", series1: 71296, series2: 544 },
    { date: "2025-01-11", series1: 89184, series2: 42464 },
    { date: "2025-01-12", series1: 53056, series2: 480 },
    { date: "2025-01-13", series1: 11232, series2: 480 },
    { date: "2025-01-14", series1: 1568, series2: 96 },
    { date: "2025-01-15", series1: 66240, series2: 13696 }
  ]

  // Initialize with empty data
  useEffect(() => {
    setParsedData([])
    setPastedData("")
  }, [])

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Parse data from spreadsheet paste (TSV) or CSV
  const parseSpreadsheetData = (inputText: string) => {
    const lines = inputText.trim().split('\n')
    if (lines.length < 2) return []
    
    // Detect separator (tab for spreadsheet copy, comma for CSV)
    const firstLine = lines[0]
    const separator = firstLine.includes('\t') ? '\t' : ','
    
    const headers = lines[0].split(separator).map(h => h.trim())
    if (headers.length < 2) return []
    
    // Always update series names based on the column headers from the data
    if (headers.length >= 2) {
      const dateCol = headers[0]
      const valueCol = headers[1]
      
      // Always use the column header as the series1 name for single-column data
      setAreaSettings(prev => ({ ...prev, series1Name: valueCol, series2Name: "" }))
      setBarSettings(prev => ({ ...prev, series1Name: valueCol, series2Name: "" }))
      
      // If there's a third column, use it for series2
      if (headers.length >= 3) {
        const secondValueCol = headers[2]
        setAreaSettings(prev => ({ ...prev, series1Name: valueCol, series2Name: secondValueCol }))
        setBarSettings(prev => ({ ...prev, series1Name: valueCol, series2Name: secondValueCol }))
      }
    }
    
    const data: DataPoint[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator).map(v => v.trim())
      if (values.length >= 2 && values[0] && values[1]) {
        // For single column data, put it in series1 (primary series)
        const dateValue = values[0]
        const numValue = parseFloat(values[1]) || 0
        
        // Check if we have a third column for series2
        const secondValue = values.length >= 3 ? parseFloat(values[2]) || 0 : 0
        
        data.push({
          date: dateValue,
          series1: numValue, // Primary data goes to series1
          series2: secondValue, // Secondary data (0 if not present)
        })
      }
    }
    
    return data
  }

  // Handle pasted data change
  const handleDataChange = (value: string) => {
    setPastedData(value)
    const newData = parseSpreadsheetData(value)
    if (newData.length > 0) {
      setParsedData(newData)
    } else {
      setParsedData([])
    }
  }

  // Load example data
  const loadExampleData = () => {
    setParsedData(defaultData)
    const exampleText = defaultData.map(d => `${d.date}\t${d.series1}\t${d.series2}`).join('\n')
    setPastedData(`Date\tEntry Queue\tExit Queue\n${exampleText}`)
    setAreaSettings(prev => ({ ...prev, series1Name: "Entry Queue", series2Name: "Exit Queue" }))
    setBarSettings(prev => ({ ...prev, series1Name: "Entry Queue", series2Name: "Exit Queue" }))
  }

  // Load user's specific example
  const loadExitQueueExample = () => {
    const exitQueueData = `Date	Exit Queue
2023-05-21	0
2023-05-22	0
2023-05-23	0
2023-05-24	0
2023-05-25	0
2023-05-26	0
2023-05-27	0
2023-05-28	0
2023-05-29	32
2023-05-30	32
2023-05-31	160
2023-06-01	0
2023-06-02	0
2023-06-03	32
2023-06-04	0
2023-06-05	0
2023-06-06	480
2023-06-07	11584
2023-06-08	320
2023-06-09	10528`
    
    setPastedData(exitQueueData)
    handleDataChange(exitQueueData)
    setAreaSettings(prev => ({ ...prev, series1Name: "Exit Queue", series2Name: "", chartTitle: "Exit Queue Over Time", yAxisLabel: "Exit Queue Value" }))
    setBarSettings(prev => ({ ...prev, series1Name: "Exit Queue", series2Name: "", chartTitle: "Exit Queue Over Time", yAxisLabel: "Exit Queue Value" }))
  }

  // Clear data
  const clearData = () => {
    setPastedData("")
    setParsedData([])
  }

  // Draw area chart function (existing)
  const drawAreaChart = () => {
    const canvas = areaCanvasRef.current
    if (!canvas || parsedData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 40, bottom: 60, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains('dark')
    
    // Set background based on theme
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Find max values for scaling
    const maxSeries1 = Math.max(...parsedData.map(d => d.series1))
    const maxSeries2 = Math.max(...parsedData.map(d => d.series2))
    const maxValue = Math.max(maxSeries1, maxSeries2, 1) // Ensure at least 1 to avoid division by zero

    // Draw grid lines
    ctx.strokeStyle = isDark ? "#374151" : "#f0f0f0"
    ctx.lineWidth = 1

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Draw Y-axis labels
    ctx.fillStyle = isDark ? "#d1d5db" : "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (maxValue / 5) * i
      const y = padding.top + (chartHeight / 5) * i
      const displayValue = value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toFixed(0)
      ctx.fillText(displayValue, padding.left - 10, y)
    }

    // Add Y-axis title
    ctx.save()
    ctx.translate(25, padding.top + chartHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = isDark ? "#e5e7eb" : "#374151"
    ctx.font = "bold 14px Inter, Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(areaSettings.yAxisLabel, 0, 0)
    ctx.restore()

    // Only draw series2 if it has data
    if (maxSeries2 > 0) {
      // Draw series2 area first (behind series1)
      ctx.globalAlpha = 0.4
      ctx.fillStyle = areaSettings.series2Color
      
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + chartHeight)
      
      parsedData.forEach((dataPoint, index) => {
        const x = padding.left + (chartWidth / (parsedData.length - 1)) * index
        const y = padding.top + chartHeight - (dataPoint.series2 / maxValue) * chartHeight
        
        if (index === 0) {
          ctx.lineTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
      ctx.closePath()
      ctx.fill()
    }

    // Only draw series1 if it has data
    if (maxSeries1 > 0) {
      // Draw series1 area with translucency
      ctx.globalAlpha = 0.4
      ctx.fillStyle = areaSettings.series1Color
      
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + chartHeight)
      
      parsedData.forEach((dataPoint, index) => {
        const x = padding.left + (chartWidth / (parsedData.length - 1)) * index
        const y = padding.top + chartHeight - (dataPoint.series1 / maxValue) * chartHeight
        
        if (index === 0) {
          ctx.lineTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
      ctx.closePath()
      ctx.fill()
    }

    // Draw lines on top of areas
    ctx.globalAlpha = 1
    
    // Series2 line (if has data)
    if (maxSeries2 > 0) {
      const series2LineColor = areaSettings.series2Color === "#ef4444" ? "#dc2626" : 
                              areaSettings.series2Color === "#dc2626" ? "#dc2626" : 
                              adjustColorBrightness(areaSettings.series2Color, -20)
      ctx.strokeStyle = series2LineColor
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      parsedData.forEach((dataPoint, index) => {
        const x = padding.left + (chartWidth / (parsedData.length - 1)) * index
        const y = padding.top + chartHeight - (dataPoint.series2 / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }

    // Series1 line (if has data)
    if (maxSeries1 > 0) {
      const series1LineColor = areaSettings.series1Color === "#14b8a6" ? "#0d9488" : 
                              areaSettings.series1Color === "#0d9488" ? "#0d9488" : 
                              adjustColorBrightness(areaSettings.series1Color, -20)
      ctx.strokeStyle = series1LineColor
      ctx.lineWidth = 2

      ctx.beginPath()
      parsedData.forEach((dataPoint, index) => {
        const x = padding.left + (chartWidth / (parsedData.length - 1)) * index
        const y = padding.top + chartHeight - (dataPoint.series1 / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }

    // Draw X-axis labels (sample dates)
    ctx.fillStyle = isDark ? "#d1d5db" : "#666"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    
    const labelIndices = [0, Math.floor(parsedData.length * 0.2), Math.floor(parsedData.length * 0.4), 
                         Math.floor(parsedData.length * 0.6), Math.floor(parsedData.length * 0.8), parsedData.length - 1]
    
    labelIndices.forEach((index) => {
      if (index < parsedData.length) {
        const x = padding.left + (chartWidth / (parsedData.length - 1)) * index
        const dateStr = parsedData[index].date
        // Try to parse the date, fall back to showing as-is if parsing fails
        try {
          const date = new Date(dateStr)
          const label = isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          ctx.fillText(label, x, padding.top + chartHeight + 10)
        } catch {
          ctx.fillText(dateStr, x, padding.top + chartHeight + 10)
        }
      }
    })

    // Draw legend above chart in the middle - only show series that have data
    const legendCenterX = padding.left + chartWidth / 2
    const legendY = 15
    
    let legendOffset = 0
    
    // Series1 legend - only if has data
    if (maxSeries1 > 0) {
      const series1LineColor = areaSettings.series1Color === "#14b8a6" ? "#0d9488" : adjustColorBrightness(areaSettings.series1Color, -20)
      ctx.strokeStyle = series1LineColor
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(legendCenterX - 100 + legendOffset, legendY)
      ctx.lineTo(legendCenterX - 75 + legendOffset, legendY)
      ctx.stroke()
      
      ctx.fillStyle = isDark ? "#f9fafb" : "#1f2937"
      ctx.font = "bold 12px Inter, Arial, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(areaSettings.series1Name, legendCenterX - 70 + legendOffset, legendY)
      
      legendOffset += 130
    }
    
    // Series2 legend - only if has data
    if (maxSeries2 > 0) {
      const series2LineColor = areaSettings.series2Color === "#ef4444" ? "#dc2626" : adjustColorBrightness(areaSettings.series2Color, -20)
      ctx.strokeStyle = series2LineColor
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(legendCenterX - 100 + legendOffset, legendY)
      ctx.lineTo(legendCenterX - 75 + legendOffset, legendY)
      ctx.stroke()
      
      ctx.fillStyle = isDark ? "#f9fafb" : "#1f2937"
      ctx.font = "bold 12px Inter, Arial, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(areaSettings.series2Name, legendCenterX - 70 + legendOffset, legendY)
    }
  }

  // Draw bar chart function (new)
  const drawBarChart = () => {
    const canvas = barCanvasRef.current
    if (!canvas || parsedData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 40, bottom: 60, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains('dark')
    
    // Set background based on theme
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Find max values for scaling
    const maxSeries1 = Math.max(...parsedData.map(d => d.series1))
    const maxSeries2 = Math.max(...parsedData.map(d => d.series2))
    const maxValue = Math.max(maxSeries1, maxSeries2, 1)

    // Draw grid lines
    ctx.strokeStyle = isDark ? "#374151" : "#f0f0f0"
    ctx.lineWidth = 1

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Draw Y-axis labels
    ctx.fillStyle = isDark ? "#d1d5db" : "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (maxValue / 5) * i
      const y = padding.top + (chartHeight / 5) * i
      const displayValue = value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toFixed(0)
      ctx.fillText(displayValue, padding.left - 10, y)
    }

    // Add Y-axis title
    ctx.save()
    ctx.translate(25, padding.top + chartHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = isDark ? "#e5e7eb" : "#374151"
    ctx.font = "bold 14px Inter, Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(barSettings.yAxisLabel, 0, 0)
    ctx.restore()

    // Calculate bar width and spacing
    const barGroupWidth = chartWidth / parsedData.length
    const barPadding = barGroupWidth * 0.1
    const usableBarWidth = barGroupWidth - barPadding
    
    // Determine how many series have data
    const hasSeries1Data = maxSeries1 > 0
    const hasSeries2Data = maxSeries2 > 0
    const activeSeries = (hasSeries1Data ? 1 : 0) + (hasSeries2Data ? 1 : 0)
    const barWidth = activeSeries > 1 ? usableBarWidth / 2 : usableBarWidth

    // Draw bars
    parsedData.forEach((dataPoint, index) => {
      const groupX = padding.left + (barGroupWidth * index) + (barPadding / 2)
      
      let barOffset = 0
      
      // Series1 bars (if has data)
      if (hasSeries1Data) {
        const barHeight = (dataPoint.series1 / maxValue) * chartHeight
        const barY = padding.top + chartHeight - barHeight
        
        ctx.fillStyle = barSettings.series1Color
        ctx.fillRect(groupX + barOffset, barY, barWidth, barHeight)
        
        // Bar border
        ctx.strokeStyle = adjustColorBrightness(barSettings.series1Color, -20)
        ctx.lineWidth = 1
        ctx.strokeRect(groupX + barOffset, barY, barWidth, barHeight)
        
        if (activeSeries > 1) barOffset += barWidth
      }
      
      // Series2 bars (if has data)
      if (hasSeries2Data) {
        const barHeight = (dataPoint.series2 / maxValue) * chartHeight
        const barY = padding.top + chartHeight - barHeight
        
        ctx.fillStyle = barSettings.series2Color
        ctx.fillRect(groupX + barOffset, barY, barWidth, barHeight)
        
        // Bar border
        ctx.strokeStyle = adjustColorBrightness(barSettings.series2Color, -20)
        ctx.lineWidth = 1
        ctx.strokeRect(groupX + barOffset, barY, barWidth, barHeight)
      }
    })

    // Draw X-axis labels (sample dates)
    ctx.fillStyle = isDark ? "#d1d5db" : "#666"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    
    const labelIndices = [0, Math.floor(parsedData.length * 0.2), Math.floor(parsedData.length * 0.4), 
                         Math.floor(parsedData.length * 0.6), Math.floor(parsedData.length * 0.8), parsedData.length - 1]
    
    labelIndices.forEach((index) => {
      if (index < parsedData.length) {
        const x = padding.left + (barGroupWidth * index) + (barGroupWidth / 2)
        const dateStr = parsedData[index].date
        try {
          const date = new Date(dateStr)
          const label = isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          ctx.fillText(label, x, padding.top + chartHeight + 10)
        } catch {
          ctx.fillText(dateStr, x, padding.top + chartHeight + 10)
        }
      }
    })

    // Draw legend above chart
    const legendCenterX = padding.left + chartWidth / 2
    const legendY = 15
    
    let legendOffset = 0
    
    // Series1 legend - show square for bars
    if (hasSeries1Data) {
      ctx.fillStyle = barSettings.series1Color
      ctx.fillRect(legendCenterX - 100 + legendOffset, legendY - 5, 20, 10)
      ctx.strokeStyle = adjustColorBrightness(barSettings.series1Color, -20)
      ctx.lineWidth = 1
      ctx.strokeRect(legendCenterX - 100 + legendOffset, legendY - 5, 20, 10)
      
      ctx.fillStyle = isDark ? "#f9fafb" : "#1f2937"
      ctx.font = "bold 12px Inter, Arial, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(barSettings.series1Name, legendCenterX - 75 + legendOffset, legendY)
      
      legendOffset += 130
    }
    
    // Series2 legend - show square for bars
    if (hasSeries2Data) {
      ctx.fillStyle = barSettings.series2Color
      ctx.fillRect(legendCenterX - 100 + legendOffset, legendY - 5, 20, 10)
      ctx.strokeStyle = adjustColorBrightness(barSettings.series2Color, -20)
      ctx.lineWidth = 1
      ctx.strokeRect(legendCenterX - 100 + legendOffset, legendY - 5, 20, 10)
      
      ctx.fillStyle = isDark ? "#f9fafb" : "#1f2937"
      ctx.font = "bold 12px Inter, Arial, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(barSettings.series2Name, legendCenterX - 75 + legendOffset, legendY)
    }
  }

  // Helper function to adjust color brightness
  const adjustColorBrightness = (color: string, percent: number) => {
    const num = parseInt(color.replace("#",""),16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          B = (num >> 8 & 0x00FF) + amt,
          G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
  }

  // Draw charts when data or settings change
  useEffect(() => {
    const timer = setTimeout(() => {
      drawAreaChart()
      drawBarChart()
    }, 50)
    
    return () => clearTimeout(timer)
  }, [parsedData, areaSettings, barSettings])

  // Redraw charts when dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Dark mode changed, redraw charts
          setTimeout(() => {
            drawAreaChart()
            drawBarChart()
          }, 50)
        }
      })
    })

    // Observe changes to the html element's class attribute
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [parsedData, areaSettings, barSettings])

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Input */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paste Your Data</h3>
            <div className="flex gap-2">
              <button
                onClick={loadExampleData}
                className="px-4 py-2 text-sm text-white rounded-lg transition-colors"
                style={{ 
                  backgroundColor: areaSettings.series1Color,
                  borderColor: areaSettings.series1Color 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = adjustColorBrightness(areaSettings.series1Color, -10)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = areaSettings.series1Color
                }}
              >
                Load Example
              </button>
              <button
                onClick={clearData}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mb-4 p-4 rounded-lg border transition-colors" style={{ 
            backgroundColor: `${areaSettings.series1Color}10`,
            borderColor: `${areaSettings.series1Color}40`
          }}>
            <p className="text-sm transition-colors" style={{ color: adjustColorBrightness(areaSettings.series1Color, -40) }}>
              <strong>Pro Tip:</strong> Copy and paste directly from Google Sheets, Excel, or any spreadsheet! 
              The app automatically detects tab-separated values.
            </p>
          </div>
          <textarea
            value={pastedData}
            onChange={(e) => handleDataChange(e.target.value)}
            className="w-full h-[28rem] text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg p-3 resize-none focus:ring-2 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${areaSettings.series1Color}80`
              e.currentTarget.style.borderColor = areaSettings.series1Color
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            placeholder="Copy and paste from your spreadsheet here...&#10;&#10;Example:&#10;Date	Exit Queue&#10;2023-05-21	0&#10;2023-05-22	0&#10;2023-05-23	32&#10;..."
          />
          <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{parsedData.length} data points parsed</span>
            <span>{pastedData.includes('\t') ? 'Tab-separated (from spreadsheet)' : pastedData.includes(',') ? 'Comma-separated' : 'No data'}</span>
          </div>
        </div>

        {/* Chart Settings */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors">
          {/* Chart Type Tabs */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">Chart Type</label>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors">
              <button
                onClick={() => setActiveChartType("area")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeChartType === "area"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
                style={activeChartType === "area" ? { color: areaSettings.series1Color } : {}}
              >
                Area Chart
              </button>
              <button
                onClick={() => setActiveChartType("bar")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeChartType === "bar"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
                style={activeChartType === "bar" ? { color: areaSettings.series1Color } : {}}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Chart Title */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
              <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-3">Chart Information</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Chart Title</label>
                  <input
                    type="text"
                    value={currentSettings.chartTitle}
                    onChange={(e) => setCurrentSettings(prev => ({ ...prev, chartTitle: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white transition-all focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800"
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${areaSettings.series1Color}80`
                      e.currentTarget.style.borderColor = areaSettings.series1Color
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = ''
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                    placeholder="Enter chart title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Y-Axis Label</label>
                  <input
                    type="text"
                    value={currentSettings.yAxisLabel}
                    onChange={(e) => setCurrentSettings(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white transition-all focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800"
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${areaSettings.series1Color}80`
                      e.currentTarget.style.borderColor = areaSettings.series1Color
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = ''
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                    placeholder="Enter Y-axis label"
                  />
                </div>
              </div>
            </div>

            {/* Data Series */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
              <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-3">Data Series</label>
              
              {/* Series 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Series 1</span>
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                    style={{ backgroundColor: currentSettings.series1Color }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={currentSettings.series1Name}
                      onChange={(e) => setCurrentSettings(prev => ({ ...prev, series1Name: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm transition-all focus:ring-2 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${areaSettings.series1Color}80`
                        e.currentTarget.style.borderColor = areaSettings.series1Color
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = ''
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      placeholder="Series name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">COLOUR</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={currentSettings.series1Color}
                        onChange={(e) => setCurrentSettings(prev => ({ ...prev, series1Color: e.target.value }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="series1-color"
                      />
                      <div 
                        className="w-full h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: currentSettings.series1Color }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Series 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Series 2</span>
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                    style={{ backgroundColor: currentSettings.series2Color }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={currentSettings.series2Name}
                      onChange={(e) => setCurrentSettings(prev => ({ ...prev, series2Name: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm transition-all focus:ring-2 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${areaSettings.series1Color}80`
                        e.currentTarget.style.borderColor = areaSettings.series1Color
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = ''
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      placeholder="Series name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">COLOUR</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={currentSettings.series2Color}
                        onChange={(e) => setCurrentSettings(prev => ({ ...prev, series2Color: e.target.value }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="series2-color"
                      />
                      <div 
                        className="w-full h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: currentSettings.series2Color }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="space-y-6">
        {/* Area Chart */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{areaSettings.chartTitle}</h3>
            <button
              onClick={() => {
                const canvas = areaCanvasRef.current
                if (!canvas) return
                
                // Create a new canvas for export with background and title
                const exportCanvas = document.createElement('canvas')
                const exportCtx = exportCanvas.getContext('2d')
                if (!exportCtx) return
                
                // Get original canvas dimensions and add space for title
                const dpr = window.devicePixelRatio || 1
                const rect = canvas.getBoundingClientRect()
                const titleHeight = 60 // Extra space for title
                
                // Set export canvas size (taller to accommodate title)
                exportCanvas.width = canvas.width
                exportCanvas.height = canvas.height + (titleHeight * dpr)
                
                // Scale for device pixel ratio
                exportCtx.scale(dpr, dpr)
                
                // Check if dark mode is active and set background accordingly
                const isDark = document.documentElement.classList.contains('dark')
                exportCtx.fillStyle = isDark ? '#1f2937' : '#ffffff'
                exportCtx.fillRect(0, 0, rect.width, rect.height + titleHeight)
                
                // Add title at the top with proper spacing
                exportCtx.fillStyle = isDark ? '#f9fafb' : '#1f2937'
                exportCtx.font = 'bold 18px Inter, Arial, sans-serif'
                exportCtx.textAlign = 'left'
                exportCtx.textBaseline = 'top'
                exportCtx.fillText(`${areaSettings.chartTitle}`, 24, 20)
                
                // Copy the original canvas content below the title
                exportCtx.drawImage(canvas, 0, titleHeight, rect.width, rect.height)
                
                // Create download link
                exportCanvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `chart-area-${new Date().toISOString().split('T')[0]}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  }
                }, 'image/png')
              }}
              disabled={parsedData.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
          
          <canvas 
            ref={areaCanvasRef} 
            className="w-full h-96 cursor-crosshair rounded border border-gray-100 dark:border-gray-600" 
            style={{ width: "100%", height: "400px" }} 
          />
          
          {parsedData.length === 0 && (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Ready for Your Data</div>
                <div className="text-sm max-w-md text-gray-400 dark:text-gray-500">
                  Copy your data from Google Sheets, Excel, or any spreadsheet and paste it in the text area above. 
                  The area chart will automatically update!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{barSettings.chartTitle}</h3>
            <button
              onClick={() => {
                const canvas = barCanvasRef.current
                if (!canvas) return
                
                // Create a new canvas for export with background and title
                const exportCanvas = document.createElement('canvas')
                const exportCtx = exportCanvas.getContext('2d')
                if (!exportCtx) return
                
                // Get original canvas dimensions and add space for title
                const dpr = window.devicePixelRatio || 1
                const rect = canvas.getBoundingClientRect()
                const titleHeight = 60 // Extra space for title
                
                // Set export canvas size (taller to accommodate title)
                exportCanvas.width = canvas.width
                exportCanvas.height = canvas.height + (titleHeight * dpr)
                
                // Scale for device pixel ratio
                exportCtx.scale(dpr, dpr)
                
                // Check if dark mode is active and set background accordingly
                const isDark = document.documentElement.classList.contains('dark')
                exportCtx.fillStyle = isDark ? '#1f2937' : '#ffffff'
                exportCtx.fillRect(0, 0, rect.width, rect.height + titleHeight)
                
                // Add title at the top with proper spacing
                exportCtx.fillStyle = isDark ? '#f9fafb' : '#1f2937'
                exportCtx.font = 'bold 18px Inter, Arial, sans-serif'
                exportCtx.textAlign = 'left'
                exportCtx.textBaseline = 'top'
                exportCtx.fillText(`${barSettings.chartTitle}`, 24, 20)
                
                // Copy the original canvas content below the title
                exportCtx.drawImage(canvas, 0, titleHeight, rect.width, rect.height)
                
                // Create download link
                exportCanvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `chart-bar-${new Date().toISOString().split('T')[0]}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  }
                }, 'image/png')
              }}
              disabled={parsedData.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
          
          <canvas 
            ref={barCanvasRef} 
            className="w-full h-96 cursor-crosshair rounded border border-gray-100 dark:border-gray-600" 
            style={{ width: "100%", height: "400px" }} 
          />
          
          {parsedData.length === 0 && (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Ready for Your Data</div>
                <div className="text-sm max-w-md text-gray-400 dark:text-gray-500">
                  Copy your data from Google Sheets, Excel, or any spreadsheet and paste it in the text area above. 
                  The bar chart will automatically update!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 