const BASE_URL = process.env.REACT_APP_API_URL || "https://team5555-womenline-final.onrender.com";
const AI_MODERATOR_URL = "https://womenline-moderator-2.onrender.com";
const AI_SERVICE_URL = "https://womenline-ai.onrender.com";

// Helper for fetch with JSON
async function apiFetch(path, { method = 'GET', body, token, headers = {}, ...rest } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  
  try {
    console.log(`API Call: ${method} ${BASE_URL}${path}`, { body, token: !!token });
    const res = await fetch(BASE_URL + path, opts);
    const contentType = res.headers.get('content-type');
    
    console.log(`API Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error ${res.status}:`, errorText);
      throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      console.log('API Success:', data);
      return data;
    }
    const text = await res.text();
    console.log('API Success (text):', text);
    return text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Helper for AI service API calls
async function aiApiFetch(baseUrl, path, { method = 'GET', body, token, headers = {}, ...rest } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  
  try {
    console.log(`AI API Call: ${method} ${baseUrl}${path}`, { body, token: !!token });
    const res = await fetch(baseUrl + path, opts);
    const contentType = res.headers.get('content-type');
    
    console.log(`AI API Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`AI API Error ${res.status}:`, errorText);
      throw new Error(errorText || `AI Service Error: ${res.status}`);
    }
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      console.log('AI API Success:', data);
      return data;
    }
    const text = await res.text();
    console.log('AI API Success (text):', text);
    return text;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
}

// ===== AUTHENTICATION APIs =====
export function register(data) {
  return apiFetch('/api/auth/register', { 
    method: 'POST', 
    body: {
      username: data.username || `${data.Fullname}`,
      email: data.email,
      password: data.password,
      phone: data.phone
    } 
  });
}

export function login(data) {
  return apiFetch('/api/auth/login', { 
    method: 'POST', 
    body: {
      email: data.email,
      password: data.password
    } 
  });
}

export function sendOTP(data) {
  return apiFetch('/api/auth/send-otp', { 
    method: 'POST', 
    body: { email: data.email } 
  });
}

export function verifyOTP(data) {
  return apiFetch('/api/auth/verify-otp', { 
    method: 'POST', 
    body: { 
      email: data.email, 
      otp: data.otp 
    } 
  });
}

export function checkToken(token) {
  return apiFetch('/api/auth/token-check', { 
    method: 'GET', 
    token 
  });
}

// Password Reset APIs
export function requestPasswordReset(email) {
  return apiFetch('/api/auth/forgot-password', { 
    method: 'POST', 
    body: { email } 
  });
}

export function resetPassword(token, newPassword) {
  return apiFetch('/api/auth/reset-password', { 
    method: 'POST', 
    body: { 
      token, 
      newPassword 
    } 
  });
}

// ===== JOURNAL APIs =====
export function getJournals(token) {
  return apiFetch('/api/journals', { method: 'GET', token });
}

export function createJournal(data, token) {
  return apiFetch('/api/journals', { 
    method: 'POST', 
    body: {
      mood: data.mood,
      note: data.note,
      periodDay: data.periodDay
    }, 
    token 
  });
}

// ===== PERIOD LOG APIs =====
export function createPeriodLog(data, token) {
  return apiFetch('/api/period-log', { 
    method: 'POST', 
    body: {
      mood: data.mood,
      note: data.notes || 'Period log entry',
      periodDay: data.periodDay || 'period-day'
    }, 
    token 
  });
}

export function getPeriodLogs(userId, token) {
  return apiFetch(`/api/period-log/${userId}`, { method: 'GET', token });
}

// ===== FILE UPLOAD API =====
export async function uploadFile(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    console.log('File Upload: Starting upload for', file.name);
    const res = await fetch(BASE_URL + '/api/upload/file', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    
    console.log(`File Upload Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('File Upload Error:', errorText);
      throw new Error(errorText || `Upload failed: ${res.status}`);
    }
    
    const result = await res.json();
    console.log('File Upload Success:', result);
    return result;
  } catch (error) {
    console.error('File Upload Error:', error);
    throw error;
  }
}

// ===== REWARDS & CREDITS APIs =====
export function getRewards(token) {
  return apiFetch('/api/rewards', { method: 'GET', token });
}

export function earnCredits(data, token) {
  return apiFetch('/api/rewards/earn-credits', { 
    method: 'POST', 
    body: {
      activityType: data.activityType,
      source: data.source
    }, 
    token 
  });
}

export function redeemReward(data, token) {
  return apiFetch('/api/rewards/redeem', { 
    method: 'POST', 
    body: {
      rewardId: data.rewardId,
      cost: data.cost
    }, 
    token 
  });
}

export function getUserCredits(token) {
  return apiFetch('/api/rewards/user-credits', { method: 'GET', token });
}

export function getRedemptionHistory(token) {
  return apiFetch('/api/rewards/user/redemption-history', { method: 'GET', token });
}

// ===== PDF GENERATION APIs =====
export function getSamplePdf(token) {
  return apiFetch('/api/pdf/sample', { method: 'GET', token });
}

export function exportUserSummary(token) {
  return apiFetch('/api/pdf/export-summary', { method: 'GET', token });
}

// ===== WHATSAPP API =====
export function sendWhatsApp(data, token) {
  return apiFetch('/api/whatsapp/send-whatsapp', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

// ===== VOICE API =====
export function uploadVoice(data, token) {
  return apiFetch('/api/voice/upload', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

// ===== ABUSE REPORTING APIs =====
export function reportAbuse(data, token) {
  return apiFetch('/api/abuse/report-abuse', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function getAbuseReports(token) {
  return apiFetch('/api/abuse/report-abuse', { method: 'GET', token });
}

// ===== FORUM APIs =====
export function createForumPost(data, token) {
  return apiFetch('/api/forum/forum-post', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function replyToForumPost(postId, data, token) {
  return apiFetch(`/api/forum/forum-reply/${postId}`, { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function getForumReplies(postId, token) {
  return apiFetch(`/api/forum/forum-reply/${postId}`, { method: 'GET', token });
}

export function reportForumPost(data, token) {
  return apiFetch('/api/forum/forum-post', { 
    method: 'POST', 
    body: { ...data, action: 'report' }, 
    token 
  });
}

// ===== APPOINTMENT APIs =====
export function bookAppointment(data, token) {
  return apiFetch('/api/appointments', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function getUserAppointments(token) {
  return apiFetch('/api/appointments', { method: 'GET', token });
}

export function cancelAppointment(appointmentId, token) {
  return apiFetch(`/api/appointments/${appointmentId}`, { 
    method: 'DELETE', 
    token 
  });
}

// ===== DOCTOR CHECKLIST APIs =====
export function getDoctorChecklist(token) {
  return apiFetch('/api/doctor-checklist', { method: 'GET', token });
}

export function addDoctorChecklist(data, token) {
  return apiFetch('/api/doctor-checklist', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

// ===== LEADERBOARD API =====
export function getLeaderboard(token) {
  return apiFetch('/api/leaderboard', { method: 'GET', token });
}

// ===== HEALTH CHECK API =====
export function healthCheck() {
  return apiFetch('/', { method: 'GET' });
}

// ===== AI MODERATOR APIs =====
export function aiModeratorHealthCheck() {
  return aiApiFetch(AI_MODERATOR_URL, '/', { method: 'GET' });
}

export function moderateContent(data, token) {
  return aiApiFetch(AI_MODERATOR_URL, '/moderate', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function getModerationHistory(token) {
  return aiApiFetch(AI_MODERATOR_URL, '/moderation-history', { 
    method: 'GET', 
    token 
  });
}

export function updateModerationSettings(data, token) {
  return aiApiFetch(AI_MODERATOR_URL, '/settings', { 
    method: 'PUT', 
    body: data, 
    token 
  });
}

// ===== AI SERVICE APIs =====
export function aiServiceHealthCheck() {
  return aiApiFetch(AI_SERVICE_URL, '/', { method: 'GET' });
}

export function generateAIResponse(data, token) {
  return aiApiFetch(AI_SERVICE_URL, '/generate', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function analyzeUserInput(data, token) {
  return aiApiFetch(AI_SERVICE_URL, '/analyze', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function getAIInsights(data, token) {
  return aiApiFetch(AI_SERVICE_URL, '/insights', { 
    method: 'POST', 
    body: data, 
    token 
  });
}

export function trainAIModel(data, token) {
  return aiApiFetch(AI_SERVICE_URL, '/train', { 
    method: 'POST', 
    body: data, 
    token 
  });
} 