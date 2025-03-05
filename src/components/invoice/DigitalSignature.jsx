"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"

function DigitalSignature({ data, onEdit, readOnly = true }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasInitialized, setCanvasInitialized] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    canvas.style.width = `${canvas.offsetWidth}px`
    canvas.style.height = `${canvas.offsetHeight}px`

    // Get context
    const context = canvas.getContext("2d")
    if (!context) return

    context.scale(2, 2)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 2
    contextRef.current = context
    setCanvasInitialized(true)

    // Load existing signature if available
    if (data.signature) {
      const img = new Image()
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2)
      }
      img.src = data.signature
    }
  }, [data.signature])

  const startDrawing = (e) => {
    if (!contextRef.current || readOnly) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if (e.type === "mousedown") {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e.type === "touchstart") {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling when drawing
    }

    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top

    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    if (!contextRef.current || readOnly) return

    contextRef.current.closePath()
    setIsDrawing(false)

    // Save signature
    const signatureData = canvasRef.current.toDataURL()
    data.onChange("signature", signatureData)
  }

  const draw = (e) => {
    if (!isDrawing || !contextRef.current || readOnly) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if (e.type === "mousemove") {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e.type === "touchmove") {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling when drawing
    }

    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top

    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  const clearSignature = (e) => {
    e.stopPropagation()
    if (!contextRef.current || !canvasRef.current || readOnly) return

    const canvas = canvasRef.current
    contextRef.current.clearRect(0, 0, canvas.width / 2, canvas.height / 2)
    data.onChange("signature", null)
  }

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="text-gray-600">Digital Signature</span>
        </div>
        <div className="flex gap-2">
          {!readOnly && (
            <button onClick={clearSignature} className="text-sm text-gray-500">
              Clear
            </button>
          )}
          {readOnly && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit2 className="w-5 h-5 text-[#12766A]" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50">
          {canvasInitialized ? (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
              className="w-full h-40 border border-gray-200 rounded-md bg-white touch-none"
              style={{ touchAction: "none" }}
            />
          ) : (
            <div className="w-full h-40 border border-gray-200 rounded-md bg-white flex items-center justify-center">
              Loading signature pad...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DigitalSignature

