import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Phone,
  Mail,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { Message } from '../types';

export function CommunicationCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'normal' as Message['priority']
  });

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.messages.getAll();
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages', error);
      }
    };
    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      const payload = {
        from: 'operations@ndma.gov.in',
        to: newMessage.to,
        subject: newMessage.subject,
        content: newMessage.content,
        priority: newMessage.priority,
        channel: 'Email',
        timestamp: new Date().toISOString(),
        status: 'sent' as Message['status']
      };

      const created = await api.messages.create(payload as any);
      setMessages(prev => [created, ...prev]);
      setNewMessage({ to: '', subject: '', content: '', priority: 'normal' });
      setIsNewMessageOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'read': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Communication Center</h1>
          <p className="text-gray-600">Coordinate emergency communications and alerts</p>
        </div>

        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">To</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newMessage.to}
                  onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                >
                  <option value="">Select recipient</option>
                  <option value="NDRF Team 1">NDRF Team 1</option>
                  <option value="Fire Department">Fire Department</option>
                  <option value="Police Control Room">Police Control Room</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="All Teams">All Teams</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value as Message['priority'] })}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Subject</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Message</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>Cancel</Button>
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>


      {/* Contacts Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Emergency Hotline</h3>
          <p className="text-sm text-gray-600 mb-2">24×7 Disaster Response Helpline</p>
          <p className="text-base font-bold text-red-600">+91-1078 / 011-26701728</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Control Room Email</h3>
          <p className="text-sm text-gray-600 mb-2">Send incident or alert details</p>
          <p className="text-base font-bold text-blue-600">ndrfhq@ndma.gov.in</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Headquarters</h3>
          <p className="text-sm text-gray-600 mb-2">National Disaster Management Authority</p>
          <p className="text-base font-bold text-green-700">NDMA Bhawan, New Delhi</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Public Information Office</h3>
          <p className="text-sm text-gray-600 mb-2">For media and public inquiries</p>
          <p className="text-base font-bold text-yellow-700">pio.ndma@nic.in</p>
        </Card>
      </div>


      {/* ✅ Updated Stats (3 Cards Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Messages</p>
              <p className="text-2xl text-gray-900">{messages.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        {/* Urgent */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgent Messages</p>
              <p className="text-2xl text-gray-900">
                {messages.filter(m => m.priority === 'urgent').length}
              </p>
            </div>

            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </Card>

        {/* High Priority */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-2xl text-gray-900">
                {messages.filter(m => m.priority === 'high').length}
              </p>
            </div>

            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </Card>

      </div>


      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />

            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </Card>


      {/* Messages List */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg text-gray-900">Recent Messages</h3>

          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-gray-900">{message.subject}</h4>

                    <Badge className={getPriorityColor(message.priority)} size="sm">
                      {message.priority.toUpperCase()}
                    </Badge>

                    <Badge className={getStatusColor(message.status)} size="sm">
                      {message.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>From: {message.from}</span>
                  <span>To: {message.to}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>


      {/* Message Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">From</label>
                  <p className="text-gray-900 mt-1">{selectedMessage.from}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">To</label>
                  <p className="text-gray-900 mt-1">{selectedMessage.to}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <Badge className={`${getPriorityColor(selectedMessage.priority)} block w-fit mt-1`}>
                    {selectedMessage.priority.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedMessage.status)} block w-fit mt-1`}>
                    {selectedMessage.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedMessage.content}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Timestamp</label>
                <p className="text-gray-900 mt-1">
                  {new Date(selectedMessage.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>

            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredMessages.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or send a new message.
          </p>
        </Card>
      )}

    </div>
  );
}
