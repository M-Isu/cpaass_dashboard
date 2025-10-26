import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Code, 
  BarChart3, 
  Settings, 
  Users, 
  CreditCard,
  Bell,
  Home,
  Send,
  X,
  Save,
  FileText,
  Trash2,
  Shield,
  Chrome,
  Facebook,
  MessageCircle,
  LogOut,
  User
} from "lucide-react";
import { PredictiveTextInput } from "./PredictiveTextInput";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import KeysAndSecrets from './KeysAndSecrets';
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Messaging",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Voice Calls",
    url: "#",
    icon: Phone,
  },
  {
    title: "Video",
    url: "#",
    icon: Video,
  },
  {
    title: "APIs",
    url: "#",
    icon: Code,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Keys & Secrets",
    url: "#",
    icon: Settings,
  },
];

// Removed backend integration tab - functionality moved to Quick Actions

const accountItems = [
  {
    title: "Contacts",
    url: "#",
    icon: Users,
  },
  {
    title: "Billing",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

// Default templates
const defaultTemplates = [
  {
    id: 1,
    name: "Welcome Message",
    content: "Welcome to our service! We're excited to have you on board. If you have any questions, feel free to reach out to us.",
    category: "Welcome"
  },
  {
    id: 2,
    name: "Appointment Reminder",
    content: "Hi! This is a friendly reminder about your appointment scheduled for tomorrow at 2:00 PM. Please reply to confirm.",
    category: "Reminder"
  },
  {
    id: 3,
    name: "Thank You",
    content: "Thank you for your business! We appreciate your trust in our services and look forward to serving you again.",
    category: "Thanks"
  }
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Template-related state
  const [templates, setTemplates] = useState(defaultTemplates);
  const [showTemplateSection, setShowTemplateSection] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState("General");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [showKeys, setShowKeys] = useState(false);
  const handleMenuItemClick = (title) => {
    if (title === "Messaging") {
      setShowMessagePopup(true);
    } else if (title === "Voice Calls") {
      setShowCallPopup(true);
    } else if (title === "Video") {
      setShowVideoPopup(true);
    } else if (title === "APIs") {
      setShowApiPopup(true);
    } else if (title === "Keys & Secrets") {
      setShowKeys(true);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && messagePhoneNumber.trim()) {
      try {
        // Use the new API service for WhatsApp messaging
        const response = await apiService.sendWhatsAppMessage(messagePhoneNumber, message);
        
        console.log("Message sent successfully", response);
        toast({
          title: "Message Sent",
          description: "WhatsApp message sent successfully!",
        });
        
        setShowMessagePopup(false);
        setMessage("");
        setMessagePhoneNumber("");
        setShowMessageConfirmation(true);
        setTimeout(() => {
          setShowMessageConfirmation(false);
        }, 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Failed to Send Message",
          description: error instanceof Error ? error.message : "An error occurred while sending the message",
          variant: "destructive",
        });
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
    setShowTemplateSection(false);
    setShowSaveTemplate(false);
    setTemplateName("");
    setSelectedTemplate(null);
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

  // Template functions
  const handleSaveTemplate = () => {
    if (templateName.trim() && message.trim()) {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        content: message,
        category: templateCategory
      };
      setTemplates([...templates, newTemplate]);
      setTemplateName("");
      setShowSaveTemplate(false);
      console.log("Template saved successfully!");
    }
  };

  const handleLoadTemplate = (template) => {
    setMessage(template.content);
    setSelectedTemplate(template);
    setShowTemplateSection(false);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  const getUniqueCategories = () => {
    const categories = templates.map(template => template.category);
    return [...new Set(categories)];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
  <Sidebar className="border-r border-blue-100">
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900">CPaaS Hub</h2>
              <p className="text-xs text-blue-600">Communications Platform</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-800 font-semibold">Services</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                      {item.title === "Dashboard" || item.title === "Analytics" ? (
                        <Link to={item.url} className="flex items-center space-x-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleMenuItemClick(item.title)}
                          className="w-full flex items-center space-x-2 text-left"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>


          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-800 font-semibold">Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                      <a href={item.url} className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Keys & Secrets Modal */}
      {showKeys && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Keys & Secrets</h3>
                  <p className="text-sm text-gray-500">Manage your tokens and secrets for integrations</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeys(false)}
                className="h-9 w-9 p-0 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            <div className="p-6">
              <KeysAndSecrets />
            </div>
          </div>
        </div>
      )}

      {/* Message Popup Modal */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
            
            <div className="flex">
              {/* Main Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
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
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{message.length}/160 characters</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTemplateSection(!showTemplateSection)}
                        className="h-7 px-2 text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Templates
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                        disabled={!message.trim()}
                        className="h-7 px-2 text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  {/* Save Template Section */}
                  {showSaveTemplate && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Save as Template</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Template Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Holiday Greeting"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Category</label>
                          <select
                            value={templateCategory}
                            onChange={(e) => setTemplateCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="General">General</option>
                            <option value="Welcome">Welcome</option>
                            <option value="Reminder">Reminder</option>
                            <option value="Thanks">Thanks</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={handleSaveTemplate}
                          disabled={!templateName.trim() || !message.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-xs"
                        >
                          Save Template
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowSaveTemplate(false)}
                          className="px-4 py-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                                    {/* AI-Powered Predictive Text Input */}
                                    <div className="relative">
                                      <PredictiveTextInput
                                        value={message}
                                        onChange={setMessage}
                                        placeholder="Start typing your message... AI will suggest completions as you type!"
                                        rows={5}
                                        //autoFocus
                                      />
                                      
                                      {/* AI Badge */}
                                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                        <span>🤖</span>
                                        <span>AI</span>
                                      </div>
                                    </div>
                  
                  {selectedTemplate && (
                    <div className="text-xs text-blue-600 flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Using template: {selectedTemplate.name}</span>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
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
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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

              {/* Template Sidebar */}
              {showTemplateSection && (
                <div className="w-80 border-l border-gray-200 bg-gray-50">
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Message Templates</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSection(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Click to load a template</p>
                  </div>
                  
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {getUniqueCategories().map(category => (
                      <div key={category}>
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{category}</h4>
                        <div className="space-y-2">
                          {templates.filter(template => template.category === category).map(template => (
                            <div
                              key={template.id}
                              className="group bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                              onClick={() => handleLoadTemplate(template)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">{template.name}</h5>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.content}</p>
                                </div>
                                {template.id > 3 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTemplate(template.id);
                                    }}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {templates.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No templates saved yet</p>
                        <p className="text-xs text-gray-400">Create your first template by typing a message and clicking Save</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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