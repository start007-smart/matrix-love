// ==================== 矩阵代码雨效果 ====================
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 矩阵字符集（包含数字、字母和一些特殊字符）
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);

        this.animate();
    }

    animate() {
        // 半透明黑色背景，创建拖尾效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // 随机重置雨滴
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== 粒子爱心效果 ====================
class ParticleHeart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;

        this.particles = [];
        this.particleCount = 150; // 增加粒子数量
        this.time = 0;

        this.init();
        this.animate();
    }

    // 爱心方程
    heartShape(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            const t = (Math.PI * 2 * i) / this.particleCount;
            const pos = this.heartShape(t);

            this.particles.push({
                x: pos.x * 6 + 200,
                y: pos.y * 6 + 200,
                baseX: pos.x * 6 + 200,
                baseY: pos.y * 6 + 200,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2, // 增大粒子尺寸
                angle: t,
                speed: Math.random() * 0.02 + 0.01,
                depth: Math.random() * 0.5 + 0.5 // 添加深度,用于3D效果
            });
        }
    }

    animate() {
        this.time += 0.01;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制连接线 - 红色渐变
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 60) {
                    // 创建渐变连接线
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    const opacity = (1 - distance / 60) * 0.4;
                    gradient.addColorStop(0, `rgba(255, 23, 68, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(255, 82, 82, ${opacity * 1.2})`);
                    gradient.addColorStop(1, `rgba(255, 23, 68, ${opacity})`);

                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // 绘制粒子
        this.particles.forEach((p, index) => {
            // 更新角度
            p.angle += p.speed;
            const pos = this.heartShape(p.angle);
            p.baseX = pos.x * 6 + 200;
            p.baseY = pos.y * 6 + 200;

            // 添加轻微的随机运动
            p.x += (p.baseX - p.x) * 0.1 + p.vx;
            p.y += (p.baseY - p.y) * 0.1 + p.vy;

            // 随机速度衰减
            p.vx *= 0.95;
            p.vy *= 0.95;

            // 随机添加新的速度
            if (Math.random() < 0.02) {
                p.vx = (Math.random() - 0.5) * 2;
                p.vy = (Math.random() - 0.5) * 2;
            }

            // 3D深度效果 - 根据时间和深度调整大小
            const depthScale = p.depth + Math.sin(this.time + index * 0.1) * 0.3;
            const currentSize = p.size * depthScale;

            // 绘制粒子外发光
            const outerGlow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 4);
            outerGlow.addColorStop(0, 'rgba(255, 23, 68, 0.6)');
            outerGlow.addColorStop(0.3, 'rgba(255, 82, 82, 0.3)');
            outerGlow.addColorStop(1, 'rgba(255, 23, 68, 0)');

            this.ctx.fillStyle = outerGlow;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2);
            this.ctx.fill();

            // 绘制粒子核心
            const coreGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
            coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            coreGradient.addColorStop(0.3, 'rgba(255, 82, 82, 1)');
            coreGradient.addColorStop(1, 'rgba(255, 23, 68, 0.8)');

            this.ctx.fillStyle = coreGradient;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#ff1744';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== 代码流爱心效果 ====================
class CodeHeart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;

        this.codes = [];
        this.chars = '♥❤💕💖💗💘💝LOVE爱'; // 更多爱心符号

        this.init();
        this.animate();
    }

    heartShape(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    }

    init() {
        for (let i = 0; i < 80; i++) { // 增加数量
            this.codes.push({
                t: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                char: this.chars[Math.floor(Math.random() * this.chars.length)],
                opacity: Math.random(),
                size: Math.random() * 14 + 10, // 增大字符尺寸
                hue: Math.random() * 20 // 色相偏移,创造红色渐变
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.codes.forEach(code => {
            code.t += code.speed;
            const pos = this.heartShape(code.t);

            const x = pos.x * 6 + 200;
            const y = pos.y * 6 + 200;

            // 绘制发光文字 - 红色系
            this.ctx.font = `bold ${code.size}px Arial`;

            // 根据色相创建不同的红色
            const red = 255;
            const green = Math.floor(23 + code.hue);
            const blue = Math.floor(68 + code.hue);

            this.ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${code.opacity})`;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `rgb(${red}, ${green}, ${blue})`;
            this.ctx.fillText(code.char, x - code.size / 2, y + code.size / 2);

            // 添加额外的外发光层
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = '#ff1744';
            this.ctx.fillText(code.char, x - code.size / 2, y + code.size / 2);

            // 重置阴影
            this.ctx.shadowBlur = 0;

            // 更新透明度 - 更动态的变化
            code.opacity = Math.abs(Math.sin(code.t * 2)) * 0.7 + 0.3;

            // 随机改变字符
            if (Math.random() < 0.03) {
                code.char = this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== 打字机效果 ====================
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // 停顿2秒
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==================== 数据流效果 ====================
class DataStream {
    constructor() {
        this.container = document.querySelector('.data-stream');
        this.createStreams();
    }

    createStreams() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                const stream = document.createElement('div');
                stream.style.position = 'absolute';
                stream.style.left = Math.random() * 100 + '%';
                stream.style.top = '-20px';
                stream.style.color = '#00ff41';
                stream.style.fontSize = '12px';
                stream.style.opacity = '0.6';
                stream.style.whiteSpace = 'nowrap';
                stream.textContent = this.generateCode();

                this.container.appendChild(stream);

                const duration = Math.random() * 3000 + 2000;
                const distance = window.innerHeight + 20;

                stream.animate([
                    { transform: 'translateY(0px)', opacity: 0.6 },
                    { transform: `translateY(${distance}px)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'linear'
                }).onfinish = () => stream.remove();
            }
        }, 200);
    }

    generateCode() {
        const codes = [
            'if(love) { return forever; }',
            'while(true) { miss(you); }',
            'const love = Infinity;',
            'function heart() { beat(); }',
            'love.status = "eternal";',
            '♥ = true;',
            'you && me = us;',
            'import love from "heart";'
        ];
        return codes[Math.floor(Math.random() * codes.length)];
    }
}

// ==================== 初始化所有效果 ====================
window.addEventListener('load', () => {
    // 矩阵代码雨
    new MatrixRain('matrixCanvas');

    // 粒子爱心
    new ParticleHeart('particleHeart');

    // 代码流爱心
    new CodeHeart('codeHeart');

    // 打字机效果
    const typingTexts = [
        '在代码的世界里，你是我唯一的常量...',
        '每一行代码，都是对你的思念...',
        '你是我生命中最美的算法...',
        'Love is not a bug, it\'s a feature...',
        '在矩阵中找到你，是我最大的幸运...'
    ];
    new TypeWriter(document.querySelector('.typing-text'), typingTexts, 80);

    // 数据流
    new DataStream();

    // 响应式调整
    window.addEventListener('resize', () => {
        const matrixCanvas = document.getElementById('matrixCanvas');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
});

// ==================== 鼠标交互效果 ====================
document.addEventListener('mousemove', (e) => {
    // 创建跟随鼠标的粒子
    if (Math.random() < 0.1) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00ff41';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '100';
        particle.style.boxShadow = '0 0 10px #00ff41';

        document.body.appendChild(particle);

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            {
                transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
});

// ==================== 点击爆炸效果 ====================
document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = i % 2 === 0 ? '#00ff41' : '#00ff88';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '100';
        particle.style.boxShadow = `0 0 10px ${i % 2 === 0 ? '#00ff41' : '#00ff88'}`;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
});
