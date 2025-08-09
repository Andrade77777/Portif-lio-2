// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateHeroChartTheme();
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav ul');

if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) nav.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all sections and animated elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe animated elements
    document.querySelectorAll('.solution-card, .testimonial-card, .stat-card, .service-item, .integration-category').forEach(element => {
        observer.observe(element);
    });
    
    // Initialize hero chart
    setTimeout(() => {
        createHeroChart();
    }, 100);
});

// ROI Calculator
const investmentInput = document.getElementById('investment');
const scenarioBtns = document.querySelectorAll('.scenario-btn');
const roiAnnual = document.getElementById('roiAnnual');
const return1Year = document.getElementById('return1Year');
const return3Years = document.getElementById('return3Years');
const savings = document.getElementById('savings');
const riskText = document.getElementById('riskText');

if (investmentInput) {
    investmentInput.addEventListener('input', calculateROI);
}

if (scenarioBtns.length > 0) {
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            scenarioBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-checked', 'true');
            
            calculateROI();
        });
    });
}

function calculateROI() {
    const investment = parseFloat(investmentInput?.value) || 0;
    const activeScenario = document.querySelector('.scenario-btn.active')?.dataset.scenario || 'realistic';
    
    if (investment === 0) {
        resetROIResults();
        return;
    }
    
    let roiRate, savingsRate;
    
    switch (activeScenario) {
        case 'optimistic':
            roiRate = 0.8; // 80% ROI
            savingsRate = 0.7; // 70% savings
            updateRiskIndicator('Baixo', 'success');
            break;
        case 'realistic':
            roiRate = 0.5; // 50% ROI
            savingsRate = 0.6; // 60% savings
            updateRiskIndicator('Médio', 'warning');
            break;
        case 'conservative':
            roiRate = 0.3; // 30% ROI
            savingsRate = 0.5; // 50% savings
            updateRiskIndicator('Alto', 'error');
            break;
        default:
            roiRate = 0.5;
            savingsRate = 0.6;
    }
    
    const annualROI = investment * roiRate;
    const return1Y = investment + annualROI;
    const return3Y = investment + (annualROI * 3);
    const totalSavings = investment * savingsRate;
    
    updateROIResults({
        roiAnnual: formatCurrency(annualROI),
        return1Year: formatCurrency(return1Y),
        return3Years: formatCurrency(return3Y),
        savings: formatCurrency(totalSavings)
    });
}

function resetROIResults() {
    updateROIResults({
        roiAnnual: '-',
        return1Year: '-',
        return3Years: '-',
        savings: '-'
    });
    updateRiskIndicator('Baixo', 'success');
}

function updateROIResults(results) {
    if (roiAnnual) roiAnnual.textContent = results.roiAnnual;
    if (return1Year) return1Year.textContent = results.return1Year;
    if (return3Years) return3Years.textContent = results.return3Years;
    if (savings) savings.textContent = results.savings;
}

function updateRiskIndicator(text, type) {
    if (riskText) {
        riskText.textContent = text;
        riskText.className = `risk-text risk-${type}`;
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Lazy Loading for Images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Performance Monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Página carregada em ${loadTime}ms`);
    }
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado: ', registration);
            })
            .catch(registrationError => {
                console.log('SW falhou: ', registrationError);
            });
    });
}

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar gráfico hero
    initializeHeroChart();
    
    // Inicializar calculadora de ROI
    initializeROICalculator();
    
    // Inicializar navegação suave
    initializeSmoothScrolling();
    
    // Inicializar animações de scroll
    initializeScrollAnimations();
    
    // Inicializar menu mobile
    initializeMobileMenu();
    
    // Inicializar formulário de contato
    initializeContactForm();
    
    // Inicializar contadores animados
    initializeCounters();
    
    // Inicializar efeitos premium
    initializePremiumEffects();
    
    // Inicializar navegação por seções
    initializeSectionNavigation();
    
    // Inicializar indicativo de scroll
    initializeScrollIndicator();

    // Chat Widget Functionality
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Chat responses
    const chatResponses = {
        'preço': 'Nossos preços variam conforme a complexidade do projeto. Posso agendar uma consulta gratuita para discutir suas necessidades específicas?',
        'roi': 'Nossos clientes têm visto ROI médio de 300% no primeiro ano. Gostaria de usar nossa calculadora de ROI para ver o impacto no seu negócio?',
        'tempo': 'A implementação completa leva entre 4-8 semanas, dependendo da complexidade. Começamos a ver resultados desde a primeira semana.',
        'suporte': 'Oferecemos suporte 24/7 com equipe dedicada. Você terá acesso direto aos nossos especialistas.',
        'integração': 'Integramos com mais de 50 plataformas populares. Nossa equipe cuida de toda a configuração.',
        'garantia': 'Oferecemos garantia de ROI de 100% ou seu dinheiro de volta. Estamos confiantes nos resultados.',
        'default': 'Obrigado pela pergunta! Posso ajudar com informações sobre preços, ROI, implementação, suporte ou integrações. O que você gostaria de saber?'
    };

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (const [keyword, response] of Object.entries(chatResponses)) {
            if (message.includes(keyword)) {
                return response;
            }
        }
        
        return chatResponses.default;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, false);
            }, 1000);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Auto-open chat after 30 seconds
    setTimeout(() => {
        if (!chatContainer.classList.contains('active')) {
            chatToggle.style.animation = 'pulse 1s infinite';
        }
    }, 30000);
}

// Hero Chart
let heroChartInstance = null;

function createHeroChart() {
    console.log('Tentando criar o gráfico do Hero...');
    const ctx = document.getElementById('heroChart');
    console.log('Canvas encontrado:', ctx);
    
    if (!ctx) {
        console.error('Canvas do gráfico não encontrado!');
        return;
    }
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado!');
        return;
    }
    
    console.log('Chart.js disponível, criando gráfico...');
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    try {
        heroChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Crescimento',
                    data: [100, 150, 220, 320, 450, 650],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 6
                    }
                }
            }
        });
        console.log('Gráfico criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
    }
}

function updateHeroChartTheme() {
    if (heroChartInstance) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#e2e8f0' : '#1e293b';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        heroChartInstance.options.scales.y.ticks.color = textColor;
        heroChartInstance.options.scales.x.ticks.color = textColor;
        heroChartInstance.options.scales.y.grid.color = gridColor;
        heroChartInstance.options.scales.x.grid.color = gridColor;
        
        heroChartInstance.update();
    }
}

// Calculadora de ROI Compacta
function initializeROICalculator() {
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    const riskText = document.getElementById('riskText');
    const investmentInput = document.getElementById('investment');
    
    if (!investmentInput) return;
    
    let currentScenario = 'realistic';
    
    const scenarios = {
        realistic: {
            roiMultiplier: 2.5,
            riskText: 'Baixo',
            color: '#10b981'
        },
        optimistic: {
            roiMultiplier: 4.0,
            riskText: 'Médio',
            color: '#f59e0b'
        },
        conservative: {
            roiMultiplier: 1.8,
            riskText: 'Muito Baixo',
            color: '#6366f1'
        }
    };
    
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScenario = btn.getAttribute('data-scenario');
            updateRiskAnalysis();
            calculateROI();
        });
    });
    
    function updateRiskAnalysis() {
        const scenario = scenarios[currentScenario];
        if (riskText) {
            riskText.textContent = scenario.riskText;
            riskText.style.color = scenario.color;
        }
    }
    
    function calculateROI() {
        const investment = parseFloat(investmentInput.value) || 0;
        const scenario = scenarios[currentScenario];
        
        if (investment > 0) {
            const annualROI = investment * scenario.roiMultiplier;
            const return1Year = annualROI;
            const return3Years = annualROI * 3;
            const savings = investment * 0.7; // 70% savings
            
            const elements = {
                'roiAnnual': formatCurrency(annualROI),
                'return1Year': formatCurrency(return1Year),
                'return3Years': formatCurrency(return3Years),
                'savings': formatCurrency(savings)
            };
            
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        } else {
            const elements = ['roiAnnual', 'return1Year', 'return3Years', 'savings'];
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = '-';
                }
            });
        }
    }
    
    function formatCurrency(value) {
        return '$' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    }
    
    // Update calculation on input change
    investmentInput.addEventListener('input', calculateROI);
    
    // Initialize risk analysis
    updateRiskAnalysis();
    calculateROI();
}

// Navegação suave entre seções
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Scroll suave com easing
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                function easeInOutCubic(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t * t + b;
                    t -= 2;
                    return c / 2 * (t * t * t + 2) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

// Navegação por seções com indicadores
function initializeSectionNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

// Função global para scroll com efeitos
function scrollToSection(sectionId) {
    const targetSection = document.querySelector('#' + sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        // Adicionar efeito de destaque na seção
        targetSection.style.transition = 'all 0.3s ease';
        targetSection.style.transform = 'scale(1.02)';
        setTimeout(() => {
            targetSection.style.transform = 'scale(1)';
        }, 300);
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Animações de scroll premium com efeitos avançados
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adicionar classe de animação com delay baseado no tipo de elemento
                const delay = getAnimationDelay(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    
                    // Animar contadores quando visíveis
                    if (entry.target.classList.contains('stat-card')) {
                        animateCounter(entry.target.querySelector('.stat-number'));
                    }
                    
                    // Efeitos especiais para diferentes tipos de elementos
                    if (entry.target.classList.contains('solution-card')) {
                        animateSolutionCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('testimonial-card')) {
                        animateTestimonialCard(entry.target);
                    }
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.solution-card, .testimonial-card, .stat-card, .service-item, .integration-category');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Função para determinar delay de animação baseado no tipo de elemento
function getAnimationDelay(element) {
    if (element.classList.contains('solution-card')) {
        return 200;
    } else if (element.classList.contains('testimonial-card')) {
        return 300;
    } else if (element.classList.contains('stat-card')) {
        return 150;
    } else if (element.classList.contains('service-item')) {
        return 250;
    } else if (element.classList.contains('integration-category')) {
        return 200;
    }
    return 0;
}

// Animação especial para cards de solução
function animateSolutionCard(card) {
    const icon = card.querySelector('.solution-icon');
    const title = card.querySelector('h3');
    const features = card.querySelectorAll('.solution-features li');
    
    // Animar ícone
    if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
    
    // Animar título
    if (title) {
        title.style.color = 'var(--primary-color)';
        setTimeout(() => {
            title.style.color = '';
        }, 500);
    }
    
    // Animar features com delay
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.style.transform = 'translateX(5px)';
            feature.style.color = 'var(--text-primary)';
        }, 600 + (index * 100));
    });
}

// Animação especial para cards de testimonial
function animateTestimonialCard(card) {
    const content = card.querySelector('.testimonial-content');
    const author = card.querySelector('.testimonial-author');
    
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.6s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (author) {
        author.style.opacity = '0';
        author.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            author.style.transition = 'all 0.6s ease';
            author.style.opacity = '1';
            author.style.transform = 'translateX(0)';
        }, 400);
    }
}

// Menu mobile
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Formulário de contato premium com design elegante
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Animar estatísticas quando visíveis
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter o botão de envio
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnContent = submitBtn.querySelector('.btn-content');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Adicionar classe de loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            // Remover classe de loading
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Mostrar notificação de sucesso
            showNotification('Proposta enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.', 'success');
            
            // Resetar formulário
            contactForm.reset();
            
            // Animar reset do formulário
            animateFormReset(contactForm);
        }, 3000);
    });
    
    // Adicionar efeitos de foco nos inputs
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Animar números das estatísticas
function animateStatNumber(element) {
    const text = element.textContent;
    const isPercentage = text.includes('%');
    const isPlus = text.includes('+');
    const isTime = text.includes('h');
    
    let finalValue;
    let suffix = '';
    
    if (isPercentage) {
        finalValue = parseInt(text.replace('%', ''));
        suffix = '%';
    } else if (isPlus) {
        finalValue = parseInt(text.replace('+', ''));
        suffix = '+';
    } else if (isTime) {
        finalValue = parseInt(text.replace('h', ''));
        suffix = 'h';
    } else {
        finalValue = parseInt(text);
    }
    
    if (typeof finalValue === 'number') {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        function updateStat(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Função de easing suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue + suffix;
            
            // Efeito de destaque
            if (progress < 1) {
                element.style.transform = 'scale(1.1)';
                element.style.color = 'var(--accent-color)';
            } else {
                element.style.transform = 'scale(1)';
                element.style.color = '';
                
                // Efeito final
                element.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    element.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 150);
                }, 100);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateStat);
            }
        }
        
        requestAnimationFrame(updateStat);
    }
}

// Animar reset do formulário
function animateFormReset(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transform = 'scale(0.95)';
            input.style.opacity = '0.5';
            
            setTimeout(() => {
                input.style.transform = 'scale(1)';
                input.style.opacity = '1';
            }, 200);
        }, index * 100);
    });
}

// Contadores animados premium com efeitos avançados
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isCurrency = target.includes('$');
    const isTime = target.includes('/');
    
    let finalValue;
    let prefix = '';
    let suffix = '';
    
    if (isPercentage) {
        finalValue = parseInt(target.replace('%', ''));
        suffix = '%';
    } else if (isCurrency) {
        finalValue = parseInt(target.replace(/[$,]/g, ''));
        prefix = '$';
    } else if (isTime) {
        finalValue = target; // Manter como está para horários
    } else {
        finalValue = parseInt(target.replace(/[^\d]/g, ''));
        suffix = target.replace(/[\d]/g, ''); // Manter sufixos como "K+", "M+"
    }
    
    if (typeof finalValue === 'number') {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Função de easing suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
            
            // Formatar valor
            let displayValue = currentValue;
            if (isCurrency && currentValue >= 1000) {
                displayValue = currentValue.toLocaleString('pt-BR');
            }
            
            element.textContent = prefix + displayValue + suffix;
            
            // Adicionar efeito de destaque
            if (progress < 1) {
                element.style.transform = 'scale(1.1)';
                element.style.color = 'var(--accent-color)';
            } else {
                element.style.transform = 'scale(1)';
                element.style.color = '';
                
                // Efeito final
                element.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    element.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 150);
                }, 100);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

// Efeitos premium avançados
function initializePremiumEffects() {
    // Parallax suave para elementos de fundo
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particles, .hero-background');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Efeito de fade para seções
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            } else {
                section.style.opacity = '0.8';
                section.style.transform = 'translateY(20px)';
            }
        });
    });
    
    // Efeito de hover para cards
    const cards = document.querySelectorAll('.solution-card, .testimonial-card, .integration-category');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efeito de digitação para títulos
    const titles = document.querySelectorAll('.hero-title, .section-header h2');
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.opacity = '0';
        
        setTimeout(() => {
            title.style.opacity = '1';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            typeWriter();
        }, 1000);
    });
}

// Sistema de notificações premium
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos CSS dinamicamente
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-info {
                border-left: 4px solid #6366f1;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            
            .notification-content i {
                color: #10b981;
                font-size: 1.25rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Animações CSS adicionais
const additionalStyles = `
    .solution-card, .testimonial-card, .stat-card, .service-item, .integration-category {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .solution-card.animate-in, .testimonial-card.animate-in, .stat-card.animate-in, .service-item.animate-in, .integration-category.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
    
    .exclusivity-badge, .hero-badge {
        transition: all 0.3s ease;
    }
    
    .integration-item {
        transition: all 0.3s ease;
    }
    
    .nav-menu a.active {
        color: var(--primary-color);
        font-weight: 600;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Otimização de performance
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.particles');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Inicializar tooltips para valores
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                document.body.removeChild(tooltip);
            }
        });
    });
}

// Adicionar estilos para tooltips
const tooltipStyles = `
    .tooltip {
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #1f2937;
    }
`;

const tooltipStyleSheet = document.createElement('style');
tooltipStyleSheet.textContent = tooltipStyles;
document.head.appendChild(tooltipStyleSheet);

// Inicializar tooltips
initializeTooltips();

// Progress Tracker Animation
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressFills.forEach(fill => observer.observe(fill));
}

// Achievement Badge Animation
function animateAchievementBadges() {
    const badges = document.querySelectorAll('.achievement-badge');
    
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.animation = 'slideInRight 0.6s ease-out';
        }, index * 200);
    });
}

// Feature Score Counter Animation
function animateFeatureScores() {
    const scores = document.querySelectorAll('.score');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scoreText = entry.target.textContent;
                const [value, max] = scoreText.split('/');
                const targetValue = parseFloat(value);
                let currentValue = 0;
                
                const timer = setInterval(() => {
                    currentValue += 0.1;
                    if (currentValue >= targetValue) {
                        currentValue = targetValue;
                        clearInterval(timer);
                    }
                    entry.target.textContent = currentValue.toFixed(1) + '/' + max;
                }, 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    scores.forEach(score => observer.observe(score));
}

// Initialize animations
animateProgressBars();
animateAchievementBadges();
animateFeatureScores();

// Notification System
function initializeNotifications() {
    const notificationBanner = document.getElementById('notificationBanner');
    const enableNotifications = document.getElementById('enableNotifications');
    const dismissNotification = document.getElementById('dismissNotification');
    
    if (!notificationBanner) return;
    
    // Show notification banner after 10 seconds
    setTimeout(() => {
        if (!localStorage.getItem('notificationDismissed')) {
            notificationBanner.classList.add('show');
        }
    }, 10000);
    
    enableNotifications.addEventListener('click', () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Notificações ativadas! Você receberá novidades exclusivas.', 'success');
                    notificationBanner.classList.remove('show');
                    localStorage.setItem('notificationsEnabled', 'true');
                }
            });
        }
    });
    
    dismissNotification.addEventListener('click', () => {
        notificationBanner.classList.remove('show');
        localStorage.setItem('notificationDismissed', 'true');
    });
}

// Cookie Consent System
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');
    
    if (!cookieConsent) return;
    
    // Show cookie consent if not previously accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }
    
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.remove('show');
        showNotification('Preferências de cookies salvas!', 'success');
    });
    
    rejectCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieConsent.classList.remove('show');
        showNotification('Cookies rejeitados. Algumas funcionalidades podem não funcionar.', 'warning');
    });
}

// Comparison Chart
function initializeComparisonChart() {
    const chartCanvas = document.getElementById('comparisonChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DataInsight Pro', 'Concorrente A', 'Concorrente B', 'Concorrente C'],
            datasets: [{
                label: 'ROI Anual (%)',
                data: [250, 120, 180, 90],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(156, 163, 175, 0.6)',
                    'rgba(156, 163, 175, 0.6)',
                    'rgba(156, 163, 175, 0.6)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(156, 163, 175, 1)',
                    'rgba(156, 163, 175, 1)',
                    'rgba(156, 163, 175, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(156, 163, 175, 0.2)'
                    },
                    ticks: {
                        color: 'rgba(156, 163, 175, 0.8)',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(156, 163, 175, 0.8)',
                        maxRotation: 45
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Initialize all new features
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    initializeCookieConsent();
    initializeComparisonChart();
});

// Inicializar indicativo de scroll
function initializeScrollIndicator() {
    const scrollArrow = document.querySelector('.scroll-indicator-lateral .scroll-arrow');
    
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
} 