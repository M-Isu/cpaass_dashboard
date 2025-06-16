import { Plus, Send, Phone, Video, Code, Settings, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const actions = [
  {
    title: "Send Message",
    description: "Send SMS or chat message",
    icon: Send,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Make Call",
    description: "Start voice call",
    icon: Phone,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Video Call",
    description: "Start video session",
    icon: Video,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "API Test",
    description: "Test API endpoints",
    icon: Code,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export default function QuickActions() {
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showApiPopup, setShowApiPopup] = useState(false);
  
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callType, setCallType] = useState("outbound");
  const [videoRoomName, setVideoRoomName] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiPayload, setApiPayload] = useState("");
  const [showMessageConfirmation, setShowMessageConfirmation] = useState(false);
  const [messagePhoneNumber, setMessagePhoneNumber] = useState("");

  const handleActionClick = (actionTitle) => {
    if (actionTitle === "Send Message") {
      setShowMessagePopup(true);
    } else if (actionTitle === "Make Call") {
      setShowCallPopup(true);
    } else if (actionTitle === "Video Call") {
      setShowVideoPopup(true);
    } else if (actionTitle === "API Test") {
      setShowApiPopup(true);
    }
  };


  // const handleSendMessage = () => {
  //   if (message.trim()) {
  //     console.log("Sending message:", message);
  //     setShowMessagePopup(false);
  //     setMessage("");
  //   }
  // };


const handleSendMessage = async () => {
  if (message.trim() && messagePhoneNumber.trim()) {
    try {
      const response = await fetch('http://localhost:8555/whatsapp-send/sendtext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({

          apiId: "API5018835956",
          apiPassword: "passwordtest",
          smsType : "P",
          encoding : "T",
          senderId : "CPAAS_TEST",
          phoneNumber: messagePhoneNumber,
          textMessage: message

        })
      });

      if (response.ok) {
        console.log("Message sent successfully");
        setShowMessagePopup(false);
        setMessage("");
        setMessagePhoneNumber("");
        // Show confirmation modal
        setShowMessageConfirmation(true);
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => {
          setShowMessageConfirmation(false);
        }, 3000);
      } else {
        console.error("Failed to send message");
        // Handle error - maybe show an error modal
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle network error
    }
  }
};
  

  const handleMakeCall = () => {
    if (phoneNumber.trim()) {
      console.log("Making call to:", phoneNumber, "Type:", callType);
      setShowCallPopup(false);
      setPhoneNumber("");
    }
  };

  const handleStartVideo = () => {
    if (videoRoomName.trim()) {
      console.log("Starting video call:", videoRoomName);
      setShowVideoPopup(false);
      setVideoRoomName("");
    }
  };

  const handleApiTest = () => {
    if (apiEndpoint.trim()) {
      console.log("Testing API:", apiMethod, apiEndpoint, apiPayload);
      setShowApiPopup(false);
      setApiEndpoint("");
      setApiPayload("");
    }
  };

const handleCloseMessagePopup = () => {
  setShowMessagePopup(false);
  setMessage("");
  setMessagePhoneNumber("");
};

  const handleCloseCallPopup = () => {
    setShowCallPopup(false);
    setPhoneNumber("");
  };

  const handleCloseVideoPopup = () => {
    setShowVideoPopup(false);
    setVideoRoomName("");
  };

  const handleCloseApiPopup = () => {
    setShowApiPopup(false);
    setApiEndpoint("");
    setApiPayload("");
  };

  return (
    <>
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start h-auto p-3 border-blue-200 hover:bg-blue-50"
              onClick={() => handleActionClick(action.title)}
            >
              <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-blue-900">{action.title}</div>
                <div className="text-xs text-blue-600">{action.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Message Popup Modal */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Send Message</h3>
                  <p className="text-sm text-gray-500">Compose and send your message</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseMessagePopup}
                className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">To</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter phone number or contact name"
                    value={messagePhoneNumber}
                    onChange={(e) => setMessagePhoneNumber(e.target.value)}
                  />
                  <div className="absolute right-3 top-3">
                    <span className="text-xs text-gray-400">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Message Type</label>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">SMS</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">WhatsApp</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Email</button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message Content</label>
                  <span className="text-xs text-gray-400">{message.length}/160 characters</span>
                </div>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm leading-relaxed"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>💡 Tip: Keep messages concise and clear</span>
                  <span className={message.length > 160 ? 'text-red-500' : 'text-green-500'}>
                    {message.length <= 160 ? '✓ Single SMS' : '⚠ Multiple SMS'}
                  </span>
                </div>
              </div>

              {message.trim() && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
                  <div className="bg-white rounded-lg p-3 border shadow-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">You</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-relaxed">{message}</p>
                        <span className="text-xs text-gray-400 mt-1">Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>💰 Cost: $0.0075 per SMS</span>
                <span>🕐 Delivery: ~2-5 seconds</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCloseMessagePopup} className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
                <Button onClick={handleSendMessage} disabled={!message.trim() || !messagePhoneNumber.trim()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make Call Popup Modal */}
      {showCallPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Make Call</h3>
                  <p className="text-sm text-gray-500">Initiate voice call session</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseCallPopup} className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Call Type</label>
                <div className="flex space-x-3">
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${callType === 'outbound' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setCallType('outbound')}
                  >
                    Outbound
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${callType === 'conference' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setCallType('conference')}
                  >
                    Conference
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${callType === 'inbound' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setCallType('inbound')}
                  >
                    Test Inbound
                  </button>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Call Settings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">From:</span> +1 (555) 000-0000</div>
                  <div><span className="font-medium">Duration Limit:</span> 30 minutes</div>
                  <div><span className="font-medium">Recording:</span> Enabled</div>
                  <div><span className="font-medium">Transcription:</span> Real-time</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>💰 Cost: $0.02/min</span>
                <span>🌍 International: +$0.08/min</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCloseCallPopup} className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
                <Button onClick={handleMakeCall} disabled={!phoneNumber.trim()} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 shadow-lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Popup Modal */}
      {showVideoPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Video Call</h3>
                  <p className="text-sm text-gray-500">Create or join video session</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseVideoPopup} className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Room Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  placeholder="meeting-room-2024"
                  value={videoRoomName}
                  onChange={(e) => setVideoRoomName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Video Quality</label>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">HD (720p)</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Full HD (1080p)</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">4K</button>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-3">Session Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-purple-700">Screen Sharing</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-purple-700">Recording</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-purple-700">Chat</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-purple-700">Waiting Room</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Room Link</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://video.yourapp.com/room/${videoRoomName || 'room-name'}`}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                  />
                  <Button size="sm" className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white">Copy</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>💰 Cost: $0.004/min/participant</span>
                <span>👥 Max: 50 participants</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCloseVideoPopup} className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
                <Button onClick={handleStartVideo} disabled={!videoRoomName.trim()} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 shadow-lg">
                  <Video className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Test Popup Modal */}
      {showApiPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">API Test Console</h3>
                  <p className="text-sm text-gray-500">Test and debug API endpoints</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseApiPopup} className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Method</label>
                  <select 
                    value={apiMethod} 
                    onChange={(e) => setApiMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div className="col-span-3 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Endpoint URL</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder="https://api.yourservice.com/v1/messages"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Headers</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder={`Content-Type: application/json
Authorization: Bearer your-token
X-API-Key: your-api-key`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Request Body</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder={`{
  "to": "+1234567890",
  "message": "Hello World",
  "from": "YourApp"
}`}
                    value={apiPayload}
                    onChange={(e) => setApiPayload(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="text-sm font-semibold text-orange-800 mb-3">Quick Templates</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">Send SMS</button>
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">Make Call</button>
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">Get Account</button>
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">List Messages</button>
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">Webhook Test</button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-green-400">Response</h4>
                  <span className="text-xs text-gray-400">Status: 200 OK • 45ms</span>
                </div>
                <pre className="text-sm text-green-300 font-mono overflow-x-auto">{`{
  "status": "sent",
  "message_id": "msg_12345",
  "to": "+1234567890",
  "cost": 0.0075
}`}</pre>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>🔗 Rate Limit: 100 req/min</span>
                <span>⚡ Timeout: 30s</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCloseApiPopup} className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
                <Button onClick={handleApiTest} disabled={!apiEndpoint.trim()} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 shadow-lg">
                  <Code className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Message Confirmation Modal */}
      {showMessageConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full border border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600 mb-4">Your message has been successfully delivered.</p>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 font-medium">Status:</span>
                  <span className="text-green-600">✓ Delivered</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-green-700 font-medium">Message ID:</span>
                  <span className="text-green-600 font-mono">msg_12345</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowMessageConfirmation(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}