import { useState } from "react";
import { toast } from "react-hot-toast";
import "./adminNewsletter.css";

export default function AdminSendNewsletter() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  const send = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5001/api/admin/newsletter/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject: subject.trim(),
        content: `
            <div style="font-family:Arial,sans-serif;line-height:1.6">
              ${content.replace(/\n/g, "<br/>")}
            </div>
          `,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to send newsletter");
      return;
    }

    toast.success("Newsletter sent successfully");
    setSubject("");
    setContent("");
  };

  return (
    <div className="admin-page">
      <h1>Send Newsletter</h1>

      <div className="newsletter-box">
        <input
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Write newsletter content..."
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={send}>Send to All Subscribers</button>
      </div>
    </div>
  );
}
