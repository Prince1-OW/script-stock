import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BarcodeScannerProps {
  onDetect: (code: string) => void;
}

const BarcodeScanner = ({ onDetect }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState("");

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (e) {
      console.error("Camera access failed", e);
      setActive(false);
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.pause();
    setActive(false);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!active ? (
          <Button size="sm" onClick={start}>Start Camera</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={stop}>Stop Camera</Button>
        )}
      </div>
      <div className="rounded-md overflow-hidden border bg-black/60">
        <video ref={videoRef} className="w-full h-48 object-cover" muted playsInline />
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Enter barcode / SKU" value={manual} onChange={(e) => setManual(e.target.value)} />
        <Button onClick={() => manual && onDetect(manual.trim())}>Simulate detect</Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
