import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';
import govtLogo from 'figma:asset/41e57d94a0a11f07ecf591200122d730a7f7b6fe.png';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            onLogin(username, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#193cb8' }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                width: '100%',
                maxWidth: '28rem',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div style={{
                        width: '96px',
                        height: '96px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        marginBottom: '16px',
                        border: '2px solid #193cb8'
                    }}>
                        <img
                            src={govtLogo}
                            alt="Government of India"
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#193cb8',
                        marginBottom: '4px',
                        textAlign: 'center'
                    }}>
                        Disaster Management System
                    </h1>
                    <p style={{
                        color: '#4b5563',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>Government of India</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '4px',
                            display: 'block'
                        }}>Username</label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '4px',
                            display: 'block'
                        }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6b7280',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        style={{
                            width: '100%',
                            backgroundColor: '#193cb8',
                            color: 'white',
                            fontWeight: '600',
                            padding: '0.625rem',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#152f8a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#193cb8'}
                    >
                        Sign In
                    </Button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                }}>
                    <p>For authorized personnel only</p>
                </div>
            </div>
        </div>
    );
}