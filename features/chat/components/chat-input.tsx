"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { useRef, useState, KeyboardEvent } from "react";
import Image from "next/image";

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  disabled?: boolean;
  placeholder?: string;
  sticky?: boolean;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "+ Ask FAAN Assistant...",
  sticky = true,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    if (message.trim() || selectedImage) {
      onSendMessage(message.trim(), selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className={`${sticky ? 'sticky bottom-0' : ''}   px-4 py-4 md:px-6`}>
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={imagePreview}
              alt="Selected image"
              width={100}
              height={100}
              className="object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 w-full max-w-3xl mx-auto">
        {/* Image upload button */}
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || !!selectedImage}
          className="shrink-0"
          aria-label="Upload image"
        >
          <ImageIcon className="h-5 w-5" />
        </Button> */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          aria-label="File input"
        />

        {/* Message textarea */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="min-h-[45px] md:min-h-[50px] max-h-[200px] resize-none focus-visible:border-muted-foreground focus-visible:ring-ring/50 bg-muted dark:bg-[#EEF0F11A] rounded-3xl pt-3 pl-5 dark:border-none"
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !selectedImage)}
          size="default"
          className={`shrink-0 md:shrink-0 h-[45px] md:h-[50px] w-[45px] md:w-[50px] rounded-full ${
            message.trim() || selectedImage
              ? "bg-primary hover:bg-primary/90"
              : "bg-[#8D97A3] hover:bg-[#6D7681]"
          }`}
          aria-label="Send message"
        >
          <Send className="h-10 w-10 text-white" />
        </Button>
      </div>

      
    </div>
  );
}

