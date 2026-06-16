const App = {
    currentPage: 'dashboard',

    init() {
        this.bindNavigation();
    },

    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
    },

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        this.renderPage();
    },

    renderPage(initialPage) {
        if (initialPage) {
            this.currentPage = initialPage;
            document.querySelectorAll('.nav-item').forEach(link => {
                link.classList.toggle('active', link.dataset.page === initialPage);
            });
        }
        const content = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        const titles = {
            dashboard: '运营概览',
            walls: '岩壁线路',
            setters: '定线管理',
            members: '会员管理',
            courses: '教练课程',
            equipment: '装备租赁',
            events: '赛事活动',
            statistics: '消费统计'
        };
        if (pageTitle && titles[this.currentPage]) {
            pageTitle.textContent = titles[this.currentPage];
        }
        switch(this.currentPage) {
            case 'dashboard':
                content.innerHTML = this.renderDashboard();
                this.initDashboard();
                break;
            case 'walls':
                content.innerHTML = this.renderWalls();
                this.initWalls();
                break;
            case 'setters':
                content.innerHTML = this.renderSetters();
                this.initSetters();
                break;
            case 'members':
                content.innerHTML = this.renderMembers();
                this.initMembers();
                break;
            case 'courses':
                content.innerHTML = this.renderCourses();
                this.initCourses();
                break;
            case 'equipment':
                content.innerHTML = this.renderEquipment();
                this.initEquipment();
                break;
            case 'events':
                content.innerHTML = this.renderEvents();
                this.initEvents();
                break;
            case 'statistics':
                content.innerHTML = this.renderStatistics();
                this.initStatistics();
                break;
        }
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
    },

    handleGlobalSearch(event) {
        if (event.key === 'Enter') {
            const query = event.target.value.toLowerCase().trim();
            if (!query) return;
            
            this.navigateTo('members');
            setTimeout(() => {
                const searchInput = document.getElementById('member-search');
                if (searchInput) {
                    searchInput.value = query;
                    this.filterMembers();
                }
            }, 100);
        }
    },

    showNotifications() {
        const notifications = [
            { title: '线路更换提醒', message: '抱石区A区线路已超过30天未更换', time: '刚刚' },
            { title: '会员生日提醒', message: '张三明天生日，可赠送小礼品', time: '1小时前' },
            { title: '赛事报名提醒', message: '周末攀岩赛还有5个名额', time: '2小时前' }
        ];
        
        let modalHtml = `
            <div class="modal active" id="notifications-modal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3 class="modal-title">🔔 通知中心</h3>
                        <button class="modal-close" onclick="document.getElementById('notifications-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        ${notifications.map(n => `
                            <div style="padding: 16px; border-bottom: 1px solid #e2e8f0;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                                    <h4 style="font-weight: 600; margin: 0;">${n.title}</h4>
                                    <span style="font-size: 0.75rem; color: #718096;">${n.time}</span>
                                </div>
                                <p style="margin: 0; color: #4a5568; font-size: 0.9rem;">${n.message}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('notifications-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    renderDashboard() {
        const members = DataStore.getAll('members');
        const routes = DataStore.getAll('routes');
        const checkIns = DataStore.getAll('checkIns');
        const equipment = DataStore.getAll('equipment');
        const transactions = DataStore.getAll('transactions');
        const events = DataStore.getAll('events');
        const today = new Date().toISOString().split('T')[0];
        const todayCheckIns = checkIns.filter(c => c.date === today);

        const totalRevenue = transactions.filter(t => t.type !== 'deposit').reduce((sum, t) => sum + t.amount, 0);
        const activeMembers = members.filter(m => m.status === 'active').length;

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🏠 运营概览</h2>
                    <p class="page-subtitle">今日数据概览与核心指标</p>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="App.navigateTo('members')">
                        <span>✓</span> 快速核销
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-info">
                        <h3>会员总数</h3>
                        <p>${members.length}</p>
                        <div class="trend up">↑ ${activeMembers} 活跃会员</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✓</div>
                    <div class="stat-info">
                        <h3>今日入场</h3>
                        <p>${todayCheckIns.length}</p>
                        <div class="trend up">↑ 实时更新</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🧗</div>
                    <div class="stat-info">
                        <h3>线路数量</h3>
                        <p>${routes.length}</p>
                        <div class="trend up">↑ 3个岩壁区域</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">💰</div>
                    <div class="stat-info">
                        <h3>累计收入</h3>
                        <p>¥${totalRevenue.toLocaleString()}</p>
                        <div class="trend up">↑ ${transactions.length} 笔交易</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">🎒</div>
                    <div class="stat-info">
                        <h3>装备库存</h3>
                        <p>${equipment.reduce((s, e) => s + e.total, 0)}</p>
                        <div class="trend">${equipment.reduce((s, e) => s + e.available, 0)} 件可用</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">🏆</div>
                    <div class="stat-info">
                        <h3>活动赛事</h3>
                        <p>${events.length}</p>
                        <div class="trend up">↑ ${events.filter(e => e.status === 'open').length} 个报名中</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">📊 收入趋势</h3>
                        <select class="form-control" style="width: auto;" id="revenue-period">
                            <option value="month">本月</option>
                            <option value="quarter">本季度</option>
                            <option value="year">本年</option>
                        </select>
                    </div>
                    <div class="card-body">
                        <div id="revenue-chart"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">👤 今日入场</h3>
                        <span class="badge badge-active">${todayCheckIns.length} 人</span>
                    </div>
                    <div class="card-body">
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${todayCheckIns.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">📅</div>
                                    <p>今日暂无入场记录</p>
                                </div>
                            ` : todayCheckIns.map(checkin => `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div class="member-avatar">${checkin.memberName.charAt(0)}</div>
                                        <div>
                                            <div style="font-weight: 500;">${checkin.memberName}</div>
                                            <div style="font-size: 0.8rem; color: #718096;">${checkin.wallType}</div>
                                        </div>
                                    </div>
                                    <div style="font-size: 0.85rem; color: #718096;">${checkin.time}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🔥 热门线路</h3>
                </div>
                <div class="card-body">
                    <div class="route-grid" id="top-routes"></div>
                </div>
            </div>
        `;
    },

    initDashboard() {
        const routes = DataStore.getAll('routes');
        const topRoutesHtml = routes.slice(0, 4).map(route => {
            const setter = DataStore.getById('setters', route.setterId);
            return `
                <div class="route-card" style="border-left-color: ${route.color};">
                    <div class="route-header">
                        <span class="route-name">${route.name}</span>
                        <span class="route-grade" style="background: ${route.color};">${route.grade}</span>
                    </div>
                    <div class="route-info">定线员: ${setter ? setter.name : '未知'}</div>
                    <div class="route-info">岩点数: ${route.holdCount} 个</div>
                    <div class="route-info">区域: ${route.zone}</div>
                </div>
            `;
        }).join('');
        document.getElementById('top-routes').innerHTML = topRoutesHtml;

        const revenueData = [
            { label: '会员费', value: 5164 },
            { label: '课程费', value: 500 },
            { label: '装备租赁', value: 90 },
            { label: '赛事活动', value: 300 },
            { label: '商店销售', value: 128 }
        ];
        const maxValue = Math.max(...revenueData.map(d => d.value));
        
        document.getElementById('revenue-chart').innerHTML = revenueData.map(item => `
            <div class="chart-bar">
                <div class="chart-label">${item.label}</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${(item.value / maxValue * 100)}%;">¥${item.value}</div>
                </div>
            </div>
        `).join('');
    },

    renderWalls() {
        const walls = DataStore.getAll('walls');
        const routes = DataStore.getAll('routes');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🧗 岩壁线路管理</h2>
                    <p class="page-subtitle">管理攀岩墙分区和线路信息</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="App.showModal('add-wall-modal')">
                        <span>+</span> 新增岩壁
                    </button>
                    <button class="btn btn-primary" onclick="App.showModal('add-route-modal')">
                        <span>+</span> 新增线路
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🏔️ 岩壁区域</h3>
                </div>
                <div class="card-body">
                    <div class="wall-grid">
                        ${walls.map(wall => {
                            const wallRoutes = routes.filter(r => r.wallId === wall.id);
                            const typeNames = { bouldering: '抱石', lead: '难度', speed: '速度' };
                            return `
                                <div class="wall-card">
                                    <div class="wall-header">
                                        <span class="wall-name">${wall.name}</span>
                                        <span class="wall-type">${typeNames[wall.type]}</span>
                                    </div>
                                    <div class="wall-info">
                                        <div>高度: ${wall.height}</div>
                                        <div>线路数: ${wallRoutes.length} 条</div>
                                    </div>
                                    <div class="wall-zones">
                                        ${wall.zones.map(z => `<span class="zone-tag">${z}</span>`).join('')}
                                    </div>
                                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                                        <button class="btn btn-sm btn-primary" onclick="App.viewWallRoutes(${wall.id})">查看线路</button>
                                        <button class="btn btn-sm btn-secondary" onclick="App.editWall(${wall.id})">编辑</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📍 所有线路</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" class="form-control" placeholder="搜索线路名称..." id="route-search" oninput="App.filterRoutes()">
                        </div>
                        <select class="form-control" id="filter-wall" onchange="App.filterRoutes()">
                            <option value="">所有岩壁</option>
                            ${walls.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                        </select>
                        <select class="form-control" id="filter-grade" onchange="App.filterRoutes()">
                            <option value="">所有难度</option>
                            <option value="V0-V2">V0-V2 入门</option>
                            <option value="V3-V5">V3-V5 进阶</option>
                            <option value="V6+">V6+ 高手</option>
                            <option value="5.8-5.10">5.8-5.10 初级</option>
                            <option value="5.11-5.12">5.11-5.12 中级</option>
                            <option value="5.13+">5.13+ 高级</option>
                        </select>
                    </div>
                    <div class="route-grid" id="routes-list">
                        ${this.renderRoutesList(routes)}
                    </div>
                </div>
            </div>

            <div class="modal" id="add-wall-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增岩壁</h3>
                        <button class="modal-close" onclick="App.hideModal('add-wall-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="wall-form">
                            <div class="form-group">
                                <label>岩壁名称</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="bouldering">抱石</option>
                                        <option value="lead">难度</option>
                                        <option value="speed">速度</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>高度</label>
                                    <input type="text" class="form-control" name="height" placeholder="如: 4.5米" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>分区(用逗号分隔)</label>
                                <input type="text" class="form-control" name="zones" placeholder="如: 暖身区, 进阶区, 高手区" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-wall-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveWall()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-route-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增线路</h3>
                        <button class="modal-close" onclick="App.hideModal('add-route-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="route-form">
                            <div class="form-group">
                                <label>线路名称</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>所属岩壁</label>
                                    <select class="form-control" name="wallId" required onchange="App.updateZoneOptions(this.value)">
                                        ${walls.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>分区</label>
                                    <select class="form-control" name="zone" id="route-zone" required>
                                        ${walls[0] ? walls[0].zones.map(z => `<option value="${z}">${z}</option>`).join('') : ''}
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>难度等级</label>
                                    <input type="text" class="form-control" name="grade" placeholder="如: V3, 5.10a" required>
                                </div>
                                <div class="form-group">
                                    <label>岩点颜色</label>
                                    <input type="color" class="form-control" name="color" value="#FF6B6B" required style="height: 42px; padding: 4px;">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>定线员</label>
                                    <select class="form-control" name="setterId" required>
                                        ${DataStore.getAll('setters').map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>岩点数量</label>
                                    <input type="number" class="form-control" name="holdCount" min="1" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>创建日期</label>
                                    <input type="date" class="form-control" name="createDate" required>
                                </div>
                                <div class="form-group">
                                    <label>下次更换日期</label>
                                    <input type="date" class="form-control" name="nextReplaceDate" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-route-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveRoute()">保存</button>
                    </div>
                </div>
            </div>
        `;
    },

    initWalls() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelector('#route-form [name="createDate"]').value = today;
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 2);
        document.querySelector('#route-form [name="nextReplaceDate"]').value = nextDate.toISOString().split('T')[0];
    },

    renderRoutesList(routes) {
        if (routes.length === 0) {
            return `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-icon">🧗</div>
                    <p>暂无线路数据</p>
                </div>
            `;
        }
        return routes.map(route => {
            const setter = DataStore.getById('setters', route.setterId);
            const wall = DataStore.getById('walls', route.wallId);
            const today = new Date();
            const replaceDate = new Date(route.nextReplaceDate);
            const daysUntilReplace = Math.ceil((replaceDate - today) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="route-card" style="border-left-color: ${route.color};">
                    <div class="route-header">
                        <span class="route-name">${route.name}</span>
                        <span class="route-grade" style="background: ${route.color};">${route.grade}</span>
                    </div>
                    <div class="route-info">
                        <span class="color-dot" style="background: ${route.color};"></span>
                        ${wall ? wall.name : '未知'} · ${route.zone}
                    </div>
                    <div class="route-info">定线员: ${setter ? setter.name : '未知'}</div>
                    <div class="route-info">岩点数: ${route.holdCount} 个</div>
                    <div class="route-info" style="${daysUntilReplace < 7 ? 'color: #e53e3e;' : ''}">
                        ${daysUntilReplace < 0 ? '已过期' : `剩余 ${daysUntilReplace} 天更换`}
                    </div>
                    <div style="display: flex; gap: 6px; margin-top: 12px;">
                        <button class="btn btn-sm btn-primary" onclick="App.editRoute(${route.id})">编辑</button>
                        <button class="btn btn-sm btn-warning" onclick="App.replaceRoute(${route.id})">更换</button>
                        <button class="btn btn-sm btn-danger" onclick="App.deleteRoute(${route.id})">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    filterRoutes() {
        const search = document.getElementById('route-search').value.toLowerCase();
        const wallId = document.getElementById('filter-wall').value;
        const grade = document.getElementById('filter-grade').value;
        
        let routes = DataStore.getAll('routes');
        
        if (search) {
            routes = routes.filter(r => r.name.toLowerCase().includes(search));
        }
        if (wallId) {
            routes = routes.filter(r => r.wallId === parseInt(wallId));
        }
        if (grade) {
            routes = routes.filter(r => {
                if (grade === 'V0-V2') return r.grade.startsWith('V') && parseInt(r.grade.slice(1)) <= 2;
                if (grade === 'V3-V5') return r.grade.startsWith('V') && parseInt(r.grade.slice(1)) >= 3 && parseInt(r.grade.slice(1)) <= 5;
                if (grade === 'V6+') return r.grade.startsWith('V') && parseInt(r.grade.slice(1)) >= 6;
                if (grade === '5.8-5.10') return r.grade.startsWith('5.') && parseFloat(r.grade.slice(2)) <= 10;
                if (grade === '5.11-5.12') return r.grade.startsWith('5.') && parseFloat(r.grade.slice(2)) >= 11 && parseFloat(r.grade.slice(2)) <= 12;
                if (grade === '5.13+') return r.grade.startsWith('5.') && parseFloat(r.grade.slice(2)) >= 13;
                return true;
            });
        }
        
        document.getElementById('routes-list').innerHTML = this.renderRoutesList(routes);
    },

    updateZoneOptions(wallId) {
        const wall = DataStore.getById('walls', parseInt(wallId));
        const zoneSelect = document.getElementById('route-zone');
        if (wall) {
            zoneSelect.innerHTML = wall.zones.map(z => `<option value="${z}">${z}</option>`).join('');
        }
    },

    saveWall() {
        const form = document.getElementById('wall-form');
        const formData = new FormData(form);
        const zones = formData.get('zones').split(',').map(z => z.trim());
        
        const wall = {
            name: formData.get('name'),
            type: formData.get('type'),
            height: formData.get('height'),
            zones: zones,
            status: 'active'
        };
        
        DataStore.add('walls', wall);
        this.hideModal('add-wall-modal');
        this.showToast('岩壁创建成功！');
        this.renderPage();
    },

    saveRoute() {
        const form = document.getElementById('route-form');
        const formData = new FormData(form);
        
        const route = {
            name: formData.get('name'),
            wallId: parseInt(formData.get('wallId')),
            zone: formData.get('zone'),
            grade: formData.get('grade'),
            color: formData.get('color'),
            setterId: parseInt(formData.get('setterId')),
            holdCount: parseInt(formData.get('holdCount')),
            createDate: formData.get('createDate'),
            nextReplaceDate: formData.get('nextReplaceDate'),
            status: 'active'
        };
        
        DataStore.add('routes', route);
        this.hideModal('add-route-modal');
        this.showToast('线路创建成功！');
        this.renderPage();
    },

    editRoute(id) {
        const route = DataStore.getById('routes', id);
        if (!route) return;
        
        const walls = DataStore.getAll('walls');
        const setters = DataStore.getAll('setters');
        
        const modalHtml = `
            <div class="modal active" id="edit-route-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑线路</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-route-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-route-form">
                            <div class="form-group">
                                <label>线路名称</label>
                                <input type="text" class="form-control" name="name" value="${route.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>难度等级</label>
                                    <input type="text" class="form-control" name="grade" value="${route.grade}" required>
                                </div>
                                <div class="form-group">
                                    <label>岩点颜色</label>
                                    <input type="color" class="form-control" name="color" value="${route.color}" required style="height: 42px; padding: 4px;">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>岩点数量</label>
                                    <input type="number" class="form-control" name="holdCount" value="${route.holdCount}" required>
                                </div>
                                <div class="form-group">
                                    <label>下次更换日期</label>
                                    <input type="date" class="form-control" name="nextReplaceDate" value="${route.nextReplaceDate}" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-route-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateRoute(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateRoute(id) {
        const form = document.getElementById('edit-route-form');
        const formData = new FormData(form);
        
        DataStore.update('routes', id, {
            name: formData.get('name'),
            grade: formData.get('grade'),
            color: formData.get('color'),
            holdCount: parseInt(formData.get('holdCount')),
            nextReplaceDate: formData.get('nextReplaceDate')
        });
        
        document.getElementById('edit-route-modal').remove();
        this.showToast(`线路「${formData.get('name')}」更新成功！`);
        this.refreshSettersPage();
    },

    replaceRoute(id) {
        const route = DataStore.getById('routes', id);
        if (!route) return;
        
        const today = new Date().toISOString().split('T')[0];
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 2);
        
        DataStore.update('routes', id, {
            createDate: today,
            nextReplaceDate: nextDate.toISOString().split('T')[0]
        });
        
        this.showToast('线路已标记更换！');
        this.filterRoutes();
    },

    deleteRoute(id) {
        if (confirm('确定要删除这条线路吗？')) {
            DataStore.delete('routes', id);
            this.showToast('线路已删除');
            this.filterRoutes();
        }
    },

    viewWallRoutes(wallId) {
        document.getElementById('filter-wall').value = wallId;
        this.filterRoutes();
    },

    editWall(id) {
        const wall = DataStore.getById('walls', id);
        if (!wall) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-wall-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑岩壁</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-wall-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-wall-form">
                            <div class="form-group">
                                <label>岩壁名称</label>
                                <input type="text" class="form-control" name="name" value="${wall.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="bouldering" ${wall.type === 'bouldering' ? 'selected' : ''}>抱石</option>
                                        <option value="lead" ${wall.type === 'lead' ? 'selected' : ''}>难度</option>
                                        <option value="speed" ${wall.type === 'speed' ? 'selected' : ''}>速度</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>高度</label>
                                    <input type="text" class="form-control" name="height" value="${wall.height}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>分区(用逗号分隔)</label>
                                <input type="text" class="form-control" name="zones" value="${wall.zones.join(', ')}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-wall-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateWall(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateWall(id) {
        const form = document.getElementById('edit-wall-form');
        const formData = new FormData(form);
        const zones = formData.get('zones').split(',').map(z => z.trim());
        
        DataStore.update('walls', id, {
            name: formData.get('name'),
            type: formData.get('type'),
            height: formData.get('height'),
            zones: zones
        });
        
        document.getElementById('edit-wall-modal').remove();
        this.showToast('岩壁更新成功！');
        this.renderPage();
    },

    renderSetters() {
        const setters = DataStore.getAll('setters');
        const routes = DataStore.getAll('routes');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🎯 定线管理</h2>
                    <p class="page-subtitle">管理定线员和线路更换计划</p>
                </div>
                <button class="btn btn-primary" onclick="App.showModal('add-setter-modal')">
                    <span>+</span> 新增定线员
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👤</div>
                    <div class="stat-info">
                        <h3>定线员总数</h3>
                        <p>${setters.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🔄</div>
                    <div class="stat-info">
                        <h3>待更换线路</h3>
                        <p>${routes.filter(r => new Date(r.nextReplaceDate) < new Date()).length}</p>
                        <div class="trend down">需要尽快处理</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">📅</div>
                    <div class="stat-info">
                        <h3>本周需更换</h3>
                        <p>${this.getRoutesDueInDays(7).length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🧗</div>
                    <div class="stat-info">
                        <h3>本月已更换</h3>
                        <p>${this.getReplacedThisMonth().length}</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">👥 定线员团队</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>姓名</th>
                                    <th>等级</th>
                                    <th>专长</th>
                                    <th>经验</th>
                                    <th>电话</th>
                                    <th>负责线路</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${setters.map(setter => {
                                    const setterRoutes = routes.filter(r => r.setterId === setter.id);
                                    return `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div class="member-avatar">${setter.name.charAt(0)}</div>
                                                    <span>${setter.name}</span>
                                                </div>
                                            </td>
                                            <td>${setter.level}</td>
                                            <td>${setter.specialty}</td>
                                            <td>${setter.experience}</td>
                                            <td>${setter.phone}</td>
                                            <td>${setterRoutes.length} 条</td>
                                            <td><span class="badge badge-${setter.status}">${setter.status === 'active' ? '在职' : '离职'}</span></td>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn btn-sm btn-primary" onclick="App.viewSetterRoutes(${setter.id})">线路</button>
                                                    <button class="btn btn-sm btn-secondary" onclick="App.editSetter(${setter.id})">编辑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📋 线路更换计划</h3>
                    <div style="display: flex; gap: 10px;">
                        <select class="form-control" id="replace-filter" onchange="App.filterReplaceRoutes()">
                            <option value="all">全部线路</option>
                            <option value="overdue">已过期</option>
                            <option value="week">本周到期</option>
                            <option value="month">本月到期</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>线路名称</th>
                                    <th>难度</th>
                                    <th>岩壁</th>
                                    <th>定线员</th>
                                    <th>创建日期</th>
                                    <th>下次更换</th>
                                    <th>剩余天数</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="replace-routes-list">
                                ${this.renderReplaceRoutesList(routes)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-setter-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增定线员</h3>
                        <button class="modal-close" onclick="App.hideModal('add-setter-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="setter-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>等级</label>
                                    <select class="form-control" name="level" required>
                                        <option>初级定线员</option>
                                        <option>中级定线员</option>
                                        <option>高级定线员</option>
                                        <option>省级定线员</option>
                                        <option>国家级定线员</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>经验</label>
                                    <input type="text" class="form-control" name="experience" placeholder="如: 5年" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>专长</label>
                                <input type="text" class="form-control" name="specialty" placeholder="如: 抱石、难度" required>
                            </div>
                            <div class="form-group">
                                <label>电话</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-setter-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveSetter()">保存</button>
                    </div>
                </div>
            </div>
        `;
    },

    initSetters() {
    },

    getRoutesDueInDays(days) {
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + days);
        return DataStore.getAll('routes').filter(r => {
            const replaceDate = new Date(r.nextReplaceDate);
            return replaceDate >= today && replaceDate <= targetDate;
        });
    },

    getReplacedThisMonth() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return DataStore.getAll('routes').filter(r => new Date(r.createDate) >= monthStart);
    },

    renderReplaceRoutesList(routes) {
        if (routes.length === 0) {
            return `
                <tr>
                    <td colspan="9">
                        <div class="empty-state">
                            <div class="empty-icon">✅</div>
                            <p>暂无需要更换的线路</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        const sortedRoutes = [...routes].sort((a, b) => 
            new Date(a.nextReplaceDate) - new Date(b.nextReplaceDate)
        );

        return sortedRoutes.map(route => {
            const setter = DataStore.getById('setters', route.setterId);
            const wall = DataStore.getById('walls', route.wallId);
            const today = new Date();
            const replaceDate = new Date(route.nextReplaceDate);
            const daysUntilReplace = Math.ceil((replaceDate - today) / (1000 * 60 * 60 * 24));
            
            let statusClass = 'badge-active';
            let statusText = '正常';
            if (daysUntilReplace < 0) {
                statusClass = 'badge-expired';
                statusText = '已过期';
            } else if (daysUntilReplace <= 7) {
                statusClass = 'badge-pending';
                statusText = '即将到期';
            }
            
            return `
                <tr style="${daysUntilReplace < 0 ? 'background: #fff5f5;' : daysUntilReplace <= 7 ? 'background: #fffaf0;' : ''}">
                    <td style="display: flex; align-items: center; gap: 8px;">
                        <span class="color-dot" style="background: ${route.color};"></span>
                        ${route.name}
                    </td>
                    <td><span class="badge" style="background: ${route.color}; color: white;">${route.grade}</span></td>
                    <td>${wall ? wall.name : '未知'}</td>
                    <td>${setter ? setter.name : '未知'}</td>
                    <td>${route.createDate}</td>
                    <td>${route.nextReplaceDate}</td>
                    <td style="${daysUntilReplace < 0 ? 'color: #e53e3e;' : daysUntilReplace <= 7 ? 'color: #ed8936;' : ''}">
                        ${daysUntilReplace < 0 ? `已过期 ${Math.abs(daysUntilReplace)} 天` : `${daysUntilReplace} 天`}
                    </td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-success" onclick="App.markRouteReplaced(${route.id})">标记更换</button>
                            <button class="btn btn-sm btn-primary" onclick="App.editRoute(${route.id})">编辑</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterReplaceRoutes() {
        this.refreshSettersPage();
    },

    saveSetter() {
        const form = document.getElementById('setter-form');
        const formData = new FormData(form);
        
        const setter = {
            name: formData.get('name'),
            level: formData.get('level'),
            experience: formData.get('experience'),
            specialty: formData.get('specialty'),
            phone: formData.get('phone'),
            status: 'active'
        };
        
        DataStore.add('setters', setter);
        this.hideModal('add-setter-modal');
        this.showToast('定线员添加成功！');
        this.renderPage();
    },

    editSetter(id) {
        const setter = DataStore.getById('setters', id);
        if (!setter) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-setter-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑定线员</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-setter-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-setter-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" value="${setter.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>等级</label>
                                    <select class="form-control" name="level" required>
                                        <option ${setter.level === '初级定线员' ? 'selected' : ''}>初级定线员</option>
                                        <option ${setter.level === '中级定线员' ? 'selected' : ''}>中级定线员</option>
                                        <option ${setter.level === '高级定线员' ? 'selected' : ''}>高级定线员</option>
                                        <option ${setter.level === '省级定线员' ? 'selected' : ''}>省级定线员</option>
                                        <option ${setter.level === '国家级定线员' ? 'selected' : ''}>国家级定线员</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>经验</label>
                                    <input type="text" class="form-control" name="experience" value="${setter.experience}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>专长</label>
                                <input type="text" class="form-control" name="specialty" value="${setter.specialty}" required>
                            </div>
                            <div class="form-group">
                                <label>电话</label>
                                <input type="tel" class="form-control" name="phone" value="${setter.phone}" required>
                            </div>
                            <div class="form-group">
                                <label>状态</label>
                                <select class="form-control" name="status" required>
                                    <option value="active" ${setter.status === 'active' ? 'selected' : ''}>在职</option>
                                    <option value="inactive" ${setter.status === 'inactive' ? 'selected' : ''}>离职</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-setter-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateSetter(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateSetter(id) {
        const form = document.getElementById('edit-setter-form');
        const formData = new FormData(form);
        
        DataStore.update('setters', id, {
            name: formData.get('name'),
            level: formData.get('level'),
            experience: formData.get('experience'),
            specialty: formData.get('specialty'),
            phone: formData.get('phone'),
            status: formData.get('status')
        });
        
        document.getElementById('edit-setter-modal').remove();
        this.showToast('定线员信息更新成功！');
        this.renderPage();
    },

    viewSetterRoutes(setterId) {
        const setter = DataStore.getById('setters', setterId);
        const routes = DataStore.query('routes', r => r.setterId === setterId);
        
        const modalHtml = `
            <div class="modal active" id="setter-routes-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${setter ? setter.name : ''} 负责的线路</h3>
                        <button class="modal-close" onclick="document.getElementById('setter-routes-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="route-grid">
                            ${this.renderRoutesList(routes)}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('setter-routes-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    refreshSettersPage() {
        const setters = DataStore.getAll('setters');
        const routes = DataStore.getAll('routes');
        const today = new Date();

        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-info p').textContent = setters.length;
            statCards[1].querySelector('.stat-info p').textContent = routes.filter(r => new Date(r.nextReplaceDate) < today).length;
            statCards[2].querySelector('.stat-info p').textContent = this.getRoutesDueInDays(7).length;
            statCards[3].querySelector('.stat-info p').textContent = this.getReplacedThisMonth().length;
        }

        const replaceRoutesList = document.getElementById('replace-routes-list');
        if (replaceRoutesList) {
            const filter = document.getElementById('replace-filter')?.value || 'all';
            let filteredRoutes = routes;
            if (filter === 'overdue') {
                filteredRoutes = routes.filter(r => new Date(r.nextReplaceDate) < today);
            } else if (filter === 'week') {
                filteredRoutes = this.getRoutesDueInDays(7);
            } else if (filter === 'month') {
                filteredRoutes = this.getRoutesDueInDays(30);
            }
            replaceRoutesList.innerHTML = this.renderReplaceRoutesList(filteredRoutes);
        }
    },

    markRouteReplaced(id) {
        const today = new Date().toISOString().split('T')[0];
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 2);
        
        DataStore.update('routes', id, {
            createDate: today,
            nextReplaceDate: nextDate.toISOString().split('T')[0]
        });
        
        this.showToast('线路已标记为已更换！下次更换日期: ' + nextDate.toISOString().split('T')[0]);
        this.refreshSettersPage();
    },

    renderMembers() {
        const members = DataStore.getAll('members');
        const checkIns = DataStore.getAll('checkIns');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">👥 会员管理</h2>
                    <p class="page-subtitle">管理会员信息和入场核销</p>
                </div>
                <button class="btn btn-primary" onclick="App.showModal('add-member-modal')">
                    <span>+</span> 新增会员
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-info">
                        <h3>会员总数</h3>
                        <p>${members.length}</p>
                        <div class="trend up">↑ ${members.filter(m => m.status === 'active').length} 活跃</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✓</div>
                    <div class="stat-info">
                        <h3>本月入场</h3>
                        <p>${this.getMonthCheckIns().length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">⏰</div>
                    <div class="stat-info">
                        <h3>即将到期</h3>
                        <p>${this.getExpiringMembers().length}</p>
                        <div class="trend down">需提醒续费</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">❌</div>
                    <div class="stat-info">
                        <h3>已过期</h3>
                        <p>${members.filter(m => m.status === 'expired').length}</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🎫 前台核销工作台（今日入场 ${this.getTodayCheckIns().length} 人）</h3>
                </div>
                <div class="card-body">
                    <div class="checkin-panel">
                        <div>
                            <h4 style="margin-bottom: 16px; font-weight: 600;">扫码核销</h4>
                            <div class="qr-placeholder">
                                📷 扫码区域
                            </div>
                            <div style="text-align: center;">
                                <button class="btn btn-success" onclick="App.showCheckinByPhone()">
                                    <span>📱</span> 手机号核销
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 16px; font-weight: 600;">手动核销</h4>
                            <div class="form-group">
                                <label>选择会员</label>
                                <select class="form-control" id="checkin-member">
                                    <option value="">请选择会员...</option>
                                    ${members.filter(m => m.status === 'active').map(m => 
                                        `<option value="${m.id}">${m.name} - ${m.phone}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>入场区域</label>
                                <select class="form-control" id="checkin-wall">
                                    <option value="抱石区">抱石区</option>
                                    <option value="难度区">难度区</option>
                                    <option value="速度区">速度区</option>
                                </select>
                            </div>
                            <div id="safety-briefing-container" style="display: block;">
                                <div class="member-briefing">
                                    <h4>⚠️ 抱石攀爬安全告知（入场前必须确认）</h4>
                                    <ul>
                                        <li>攀爬前必须充分热身，避免运动损伤</li>
                                        <li>注意观察周围环境，确保落点清晰</li>
                                        <li>禁止在垫子上奔跑、跳跃</li>
                                        <li>下落时注意控制身体，避免砸到他人</li>
                                        <li>遇到难度线路请量力而行，不要勉强</li>
                                        <li>如有身体不适请立即停止攀爬</li>
                                    </ul>
                                    <div style="margin-top: 12px;">
                                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                            <input type="checkbox" id="safety-agreed">
                                            <span style="font-size: 0.85rem;">我已阅读并同意以上安全须知</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="App.processCheckin()">
                                <span>✓</span> 确认入场
                            </button>
                        </div>
                    </div>
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                        <h4 style="margin-bottom: 12px; font-weight: 600;">🏃 今日实时入场（${this.getTodayCheckIns().length} 人）</h4>
                        <div style="max-height: 200px; overflow-y: auto;">
                            <table>
                                <thead>
                                    <tr>
                                        <th>时间</th>
                                        <th>会员</th>
                                        <th>区域</th>
                                        <th>安全告知</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.getTodayCheckIns().slice().reverse().slice(0, 10).map(c => `
                                        <tr>
                                            <td>${c.time}</td>
                                            <td>${c.memberName}</td>
                                            <td>${c.wallType}</td>
                                            <td>
                                                <span class="badge ${c.hasSafetyBriefing ? 'badge-active' : 'badge-expired'}">
                                                    ${c.hasSafetyBriefing ? '已确认' : '未确认'}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('') || `
                                        <tr>
                                            <td colspan="4" style="text-align: center; color: #a0aec0;">今日暂无入场</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📋 会员列表</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" class="form-control" placeholder="搜索会员姓名或电话..." id="member-search" oninput="App.filterMembers()">
                        </div>
                        <select class="form-control" id="filter-member-type" onchange="App.filterMembers()">
                            <option value="">所有类型</option>
                            <option value="年卡">年卡</option>
                            <option value="季卡">季卡</option>
                            <option value="月卡">月卡</option>
                            <option value="次卡">次卡</option>
                        </select>
                        <select class="form-control" id="filter-member-status" onchange="App.filterMembers()">
                            <option value="">所有状态</option>
                            <option value="active">正常</option>
                            <option value="expired">已过期</option>
                        </select>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>会员</th>
                                    <th>电话</th>
                                    <th>会员类型</th>
                                    <th>入会日期</th>
                                    <th>到期日期</th>
                                    <th>总入场次数</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="members-list">
                                ${this.renderMembersList(members)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📅 今日入场记录</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>会员姓名</th>
                                    <th>入场区域</th>
                                    <th>安全告知</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.getTodayCheckIns().map(c => `
                                    <tr>
                                        <td>${c.time}</td>
                                        <td>${c.memberName}</td>
                                        <td>${c.wallType}</td>
                                        <td>
                                            <span class="badge ${c.hasSafetyBriefing ? 'badge-active' : 'badge-expired'}">
                                                ${c.hasSafetyBriefing ? '已确认' : '未确认'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('') || `
                                    <tr>
                                        <td colspan="4">
                                            <div class="empty-state">
                                                <div class="empty-icon">📅</div>
                                                <p>今日暂无入场记录</p>
                                            </div>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-member-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增会员</h3>
                        <button class="modal-close" onclick="App.hideModal('add-member-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="member-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-group">
                                <label>手机号</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>会员类型</label>
                                    <select class="form-control" name="memberType" required onchange="App.updateExpireDate(this.value)">
                                        <option value="月卡">月卡</option>
                                        <option value="季卡">季卡</option>
                                        <option value="年卡">年卡</option>
                                        <option value="次卡(30次)">次卡(30次)</option>
                                        <option value="次卡(50次)">次卡(50次)</option>
                                        <option value="次卡(100次)">次卡(100次)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>到期日期</label>
                                    <input type="date" class="form-control" name="expireDate" id="member-expire" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-member-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveMember()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="checkin-phone-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">手机号核销</h3>
                        <button class="modal-close" onclick="App.hideModal('checkin-phone-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>输入手机号</label>
                            <input type="tel" class="form-control" id="checkin-phone-input" placeholder="请输入会员手机号">
                        </div>
                        <div id="phone-member-info" style="display: none;">
                        </div>
                        <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="App.searchMemberByPhone()">
                            <span>🔍</span> 查询会员
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    initMembers() {
        const wallSelect = document.getElementById('checkin-wall');
        if (wallSelect) {
            wallSelect.addEventListener('change', function() {
                const container = document.getElementById('safety-briefing-container');
                if (container) {
                    container.style.display = this.value === '抱石区' ? 'block' : 'none';
                }
            });
        }
        
        const expireInput = document.getElementById('member-expire');
        if (expireInput) {
            expireInput.value = this.calculateExpireDate('月卡');
        }
    },

    refreshMembersPage() {
        const allMembers = DataStore.getAll('members');
        const checkIns = DataStore.getAll('checkIns');
        const todayCheckIns = this.getTodayCheckIns();
        const monthCheckIns = this.getMonthCheckIns();
        const expiringMembers = this.getExpiringMembers();

        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-info p').textContent = allMembers.length;
            statCards[0].querySelector('.trend').textContent = `↑ ${allMembers.filter(m => m.status === 'active').length} 活跃`;
            statCards[1].querySelector('.stat-info p').textContent = monthCheckIns.length;
            statCards[2].querySelector('.stat-info p').textContent = expiringMembers.length;
            statCards[3].querySelector('.stat-info p').textContent = allMembers.filter(m => m.status === 'expired').length;
        }

        const workbenchTitle = document.querySelector('.card:nth-child(3) .card-title');
        if (workbenchTitle) {
            workbenchTitle.textContent = `🎫 前台核销工作台（今日入场 ${todayCheckIns.length} 人）`;
        }
        const workbenchSubTitle = document.querySelector('.card:nth-child(3) h4');
        if (workbenchSubTitle && workbenchSubTitle.textContent.includes('今日实时入场')) {
            workbenchSubTitle.textContent = `🏃 今日实时入场（${todayCheckIns.length} 人）`;
        }
        const workbenchTodayBody = document.querySelectorAll('.card:nth-child(3) tbody')[1];
        if (workbenchTodayBody) {
            if (todayCheckIns.length === 0) {
                workbenchTodayBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #a0aec0;">今日暂无入场</td>
                    </tr>
                `;
            } else {
                workbenchTodayBody.innerHTML = todayCheckIns.slice().reverse().slice(0, 10).map(c => `
                    <tr>
                        <td>${c.time}</td>
                        <td>${c.memberName}</td>
                        <td>${c.wallType}</td>
                        <td>
                            <span class="badge ${c.hasSafetyBriefing ? 'badge-active' : 'badge-expired'}">
                                ${c.hasSafetyBriefing ? '已确认' : '未确认'}
                            </span>
                        </td>
                    </tr>
                `).join('');
            }
        }

        let members = allMembers;
        const searchInput = document.getElementById('member-search');
        const typeSelect = document.getElementById('filter-member-type');
        const statusSelect = document.getElementById('filter-member-status');
        const search = searchInput?.value?.toLowerCase() || '';
        const type = typeSelect?.value || '';
        const status = statusSelect?.value || '';
        if (search) {
            members = members.filter(m => 
                m.name.toLowerCase().includes(search) || 
                m.phone.includes(search)
            );
        }
        if (type) {
            members = members.filter(m => m.memberType.includes(type));
        }
        if (status) {
            members = members.filter(m => m.status === status);
        }
        const membersList = document.getElementById('members-list');
        if (membersList) {
            membersList.innerHTML = this.renderMembersList(members);
        }

        const todayTableBody = document.querySelector('.card:nth-child(5) tbody');
        if (todayTableBody) {
            if (todayCheckIns.length === 0) {
                todayTableBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            <div class="empty-state">
                                <div class="empty-icon">📅</div>
                                <p>今日暂无入场记录</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                todayTableBody.innerHTML = todayCheckIns.map(c => `
                    <tr>
                        <td>${c.time}</td>
                        <td>${c.memberName}</td>
                        <td>${c.wallType}</td>
                        <td>
                            <span class="badge ${c.hasSafetyBriefing ? 'badge-active' : 'badge-expired'}">
                                ${c.hasSafetyBriefing ? '已确认' : '未确认'}
                            </span>
                        </td>
                    </tr>
                `).join('');
            }
        }

        const checkinMemberSelect = document.getElementById('checkin-member');
        if (checkinMemberSelect) {
            checkinMemberSelect.value = '';
        }
        const safetyCheckbox = document.getElementById('safety-agreed');
        if (safetyCheckbox) {
            safetyCheckbox.checked = false;
        }
    },

    calculateExpireDate(type) {
        const date = new Date();
        if (type.includes('年卡')) {
            date.setFullYear(date.getFullYear() + 1);
        } else if (type.includes('季卡')) {
            date.setMonth(date.getMonth() + 3);
        } else if (type.includes('月卡')) {
            date.setMonth(date.getMonth() + 1);
        } else {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date.toISOString().split('T')[0];
    },

    updateExpireDate(type) {
        document.getElementById('member-expire').value = this.calculateExpireDate(type);
    },

    getMonthCheckIns() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return DataStore.getAll('checkIns').filter(c => new Date(c.date) >= monthStart);
    },

    getExpiringMembers() {
        const now = new Date();
        const weekLater = new Date();
        weekLater.setDate(now.getDate() + 7);
        return DataStore.getAll('members').filter(m => {
            const expireDate = new Date(m.expireDate);
            return expireDate >= now && expireDate <= weekLater && m.status === 'active';
        });
    },

    getTodayCheckIns() {
        const today = new Date().toISOString().split('T')[0];
        return DataStore.getAll('checkIns').filter(c => c.date === today);
    },

    renderMembersList(members) {
        if (members.length === 0) {
            return `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <div class="empty-icon">👥</div>
                            <p>暂无会员数据</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return members.map(member => {
            const today = new Date();
            const expireDate = new Date(member.expireDate);
            const daysUntilExpire = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
            
            let statusClass = 'badge-active';
            let statusText = '正常';
            if (member.status === 'expired') {
                statusClass = 'badge-expired';
                statusText = '已过期';
            } else if (daysUntilExpire <= 7) {
                statusClass = 'badge-pending';
                statusText = `剩${daysUntilExpire}天`;
            }
            
            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="member-avatar">${member.name.charAt(0)}</div>
                            <span>${member.name}</span>
                        </div>
                    </td>
                    <td>${member.phone}</td>
                    <td>${member.memberType}</td>
                    <td>${member.joinDate}</td>
                    <td style="${daysUntilExpire <= 7 && member.status === 'active' ? 'color: #ed8936;' : ''}">
                        ${member.expireDate}
                        ${member.remainingVisits !== undefined ? ` (剩${member.remainingVisits}次)` : ''}
                    </td>
                    <td>${member.totalVisits} 次</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="App.editMember(${member.id})">编辑</button>
                            <button class="btn btn-sm btn-success" onclick="App.renewMember(${member.id})">续费</button>
                            <button class="btn btn-sm btn-warning" onclick="App.viewMemberHistory(${member.id})">记录</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterMembers() {
        const search = document.getElementById('member-search').value.toLowerCase();
        const type = document.getElementById('filter-member-type').value;
        const status = document.getElementById('filter-member-status').value;
        
        let members = DataStore.getAll('members');
        
        if (search) {
            members = members.filter(m => 
                m.name.toLowerCase().includes(search) || 
                m.phone.includes(search)
            );
        }
        if (type) {
            members = members.filter(m => m.memberType.includes(type));
        }
        if (status) {
            members = members.filter(m => m.status === status);
        }
        
        document.getElementById('members-list').innerHTML = this.renderMembersList(members);
    },

    saveMember() {
        const form = document.getElementById('member-form');
        const formData = new FormData(form);
        const memberType = formData.get('memberType');
        
        let remainingVisits = undefined;
        if (memberType.includes('次卡')) {
            const match = memberType.match(/\d+/);
            if (match) remainingVisits = parseInt(match[0]);
        }
        
        const member = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            memberType: memberType,
            joinDate: new Date().toISOString().split('T')[0],
            expireDate: formData.get('expireDate'),
            totalVisits: 0,
            status: 'active',
            photo: null
        };
        
        if (remainingVisits !== undefined) {
            member.remainingVisits = remainingVisits;
        }
        
        DataStore.add('members', member);
        this.hideModal('add-member-modal');
        this.showToast('会员创建成功！');
        this.renderPage();
    },

    processCheckin() {
        const memberId = document.getElementById('checkin-member').value;
        const wallType = document.getElementById('checkin-wall').value;
        
        if (!memberId) {
            this.showToast('请选择会员', 'error');
            return;
        }
        
        const member = DataStore.getById('members', parseInt(memberId));
        if (!member || member.status !== 'active') {
            this.showToast('会员状态无效', 'error');
            return;
        }
        
        const today = new Date();
        const expireDate = new Date(member.expireDate);
        if (expireDate < today) {
            this.showToast('会员已过期，请续费', 'error');
            return;
        }
        
        if (member.remainingVisits !== undefined && member.remainingVisits <= 0) {
            this.showToast('次卡次数已用完，请续费', 'error');
            return;
        }
        
        if (wallType === '抱石区') {
            const safetyAgreed = document.getElementById('safety-agreed').checked;
            if (!safetyAgreed) {
                this.showToast('请先确认安全须知', 'error');
                return;
            }
        }
        
        const now = new Date();
        const checkIn = {
            memberId: parseInt(memberId),
            memberName: member.name,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5),
            type: 'entry',
            wallType: wallType,
            hasSafetyBriefing: wallType === '抱石区'
        };
        
        DataStore.add('checkIns', checkIn);
        
        const updates = { totalVisits: member.totalVisits + 1 };
        if (member.remainingVisits !== undefined) {
            const newRemaining = member.remainingVisits - 1;
            updates.remainingVisits = newRemaining;
            if (newRemaining <= 0) {
                updates.status = 'expired';
            }
        }
        DataStore.update('members', parseInt(memberId), updates);
        
        this.showToast(`${member.name} 入场成功！剩余次数: ${member.remainingVisits !== undefined ? (member.remainingVisits - 1) : '无限次'}`);
        this.refreshMembersPage();
    },

    showCheckinByPhone() {
        this.showModal('checkin-phone-modal');
        const phoneInput = document.getElementById('checkin-phone-input');
        if (phoneInput) {
            phoneInput.value = '';
        }
        const infoDiv = document.getElementById('phone-member-info');
        if (infoDiv) {
            infoDiv.style.display = 'none';
            infoDiv.innerHTML = '';
        }
    },

    togglePhoneSafetyBriefing() {
        const wallType = document.getElementById('phone-checkin-wall').value;
        const container = document.getElementById('phone-safety-briefing');
        if (container) {
            container.style.display = wallType === '抱石区' ? 'block' : 'none';
        }
    },

    searchMemberByPhone() {
        const phone = document.getElementById('checkin-phone-input').value.trim();
        if (!phone) {
            this.showToast('请输入手机号', 'error');
            return;
        }
        
        const members = DataStore.query('members', m => m.phone === phone && m.status === 'active');
        
        if (members.length === 0) {
            this.showToast('未找到有效会员', 'error');
            return;
        }
        
        const member = members[0];
        const today = new Date();
        const expireDate = new Date(member.expireDate);
        
        if (expireDate < today) {
            this.showToast('会员已过期，请续费', 'error');
            return;
        }
        
        const infoDiv = document.getElementById('phone-member-info');
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
            <div class="alert alert-success">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="member-avatar">${member.name.charAt(0)}</div>
                    <div>
                        <div style="font-weight: 600;">${member.name}</div>
                        <div style="font-size: 0.85rem;">${member.memberType} · 到期: ${member.expireDate}</div>
                        ${member.remainingVisits !== undefined ? `<div style="font-size: 0.85rem;">剩余次数: ${member.remainingVisits}</div>` : ''}
                        ${member.remainingVisits !== undefined && member.remainingVisits <= 0 ? '<div style="font-size: 0.85rem; color: #e53e3e;">⚠ 次卡已用完</div>' : ''}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>入场区域</label>
                <select class="form-control" id="phone-checkin-wall" onchange="App.togglePhoneSafetyBriefing()">
                    <option value="抱石区">抱石区</option>
                    <option value="难度区">难度区</option>
                    <option value="速度区">速度区</option>
                </select>
            </div>
            <div id="phone-safety-briefing" style="display: block;">
                <div class="member-briefing">
                    <h4>⚠️ 抱石攀爬安全告知</h4>
                    <ul>
                        <li>攀爬前必须充分热身，避免运动损伤</li>
                        <li>注意观察周围环境，确保落点清晰</li>
                        <li>禁止在垫子上奔跑、跳跃</li>
                        <li>下落时注意控制身体，避免砸到他人</li>
                        <li>遇到难度线路请量力而行，不要勉强</li>
                        <li>如有身体不适请立即停止攀爬</li>
                    </ul>
                    <div style="margin-top: 12px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="phone-safety-agreed">
                            <span style="font-size: 0.85rem;">我已阅读并同意以上安全须知</span>
                        </label>
                    </div>
                </div>
            </div>
            <button class="btn btn-success" style="width: 100%; margin-top: 16px;" onclick="App.processPhoneCheckin(${member.id})">
                <span>✓</span> 确认入场
            </button>
        `;
    },

    processPhoneCheckin(memberId) {
        const wallType = document.getElementById('phone-checkin-wall').value;
        const member = DataStore.getById('members', parseInt(memberId));
        
        if (member.remainingVisits !== undefined && member.remainingVisits <= 0) {
            this.showToast('次卡次数已用完，请续费', 'error');
            return;
        }
        
        if (wallType === '抱石区') {
            const safetyAgreed = document.getElementById('phone-safety-agreed').checked;
            if (!safetyAgreed) {
                this.showToast('请先确认安全须知', 'error');
                return;
            }
        }
        
        const now = new Date();
        const checkIn = {
            memberId: parseInt(memberId),
            memberName: member.name,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5),
            type: 'entry',
            wallType: wallType,
            hasSafetyBriefing: wallType === '抱石区'
        };
        
        DataStore.add('checkIns', checkIn);
        
        const updates = { totalVisits: member.totalVisits + 1 };
        if (member.remainingVisits !== undefined) {
            const newRemaining = member.remainingVisits - 1;
            updates.remainingVisits = newRemaining;
            if (newRemaining <= 0) {
                updates.status = 'expired';
            }
        }
        DataStore.update('members', parseInt(memberId), updates);
        
        this.hideModal('checkin-phone-modal');
        this.showToast(`${member.name} 入场成功！剩余次数: ${member.remainingVisits !== undefined ? (member.remainingVisits - 1) : '无限次'}`);
        this.refreshMembersPage();
    },

    editMember(id) {
        const member = DataStore.getById('members', id);
        if (!member) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-member-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑会员</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-member-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-member-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" value="${member.name}" required>
                            </div>
                            <div class="form-group">
                                <label>手机号</label>
                                <input type="tel" class="form-control" name="phone" value="${member.phone}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>会员类型</label>
                                    <select class="form-control" name="memberType" required>
                                        <option value="月卡" ${member.memberType === '月卡' ? 'selected' : ''}>月卡</option>
                                        <option value="季卡" ${member.memberType === '季卡' ? 'selected' : ''}>季卡</option>
                                        <option value="年卡" ${member.memberType === '年卡' ? 'selected' : ''}>年卡</option>
                                        <option value="次卡(30次)" ${member.memberType.includes('30') ? 'selected' : ''}>次卡(30次)</option>
                                        <option value="次卡(50次)" ${member.memberType.includes('50') && !member.memberType.includes('100') ? 'selected' : ''}>次卡(50次)</option>
                                        <option value="次卡(100次)" ${member.memberType.includes('100') ? 'selected' : ''}>次卡(100次)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>到期日期</label>
                                    <input type="date" class="form-control" name="expireDate" value="${member.expireDate}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>状态</label>
                                <select class="form-control" name="status" required>
                                    <option value="active" ${member.status === 'active' ? 'selected' : ''}>正常</option>
                                    <option value="expired" ${member.status === 'expired' ? 'selected' : ''}>已过期</option>
                                    <option value="frozen" ${member.status === 'frozen' ? 'selected' : ''}>已冻结</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-member-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateMember(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateMember(id) {
        const form = document.getElementById('edit-member-form');
        const formData = new FormData(form);
        
        DataStore.update('members', id, {
            name: formData.get('name'),
            phone: formData.get('phone'),
            memberType: formData.get('memberType'),
            expireDate: formData.get('expireDate'),
            status: formData.get('status')
        });
        
        document.getElementById('edit-member-modal').remove();
        this.showToast('会员信息更新成功！');
        this.filterMembers();
    },

    renewMember(id) {
        const member = DataStore.getById('members', id);
        if (!member) return;
        
        const modalHtml = `
            <div class="modal active" id="renew-member-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">会员续费</h3>
                        <button class="modal-close" onclick="document.getElementById('renew-member-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 16px;">
                            <p><strong>会员:</strong> ${member.name}</p>
                            <p><strong>当前到期:</strong> ${member.expireDate}</p>
                        </div>
                        <form id="renew-form">
                            <div class="form-group">
                                <label>续费类型</label>
                                <select class="form-control" name="renewType" required onchange="App.updateRenewExpire(this.value, '${member.expireDate}')">
                                    <option value="月卡">月卡 - ¥288</option>
                                    <option value="季卡">季卡 - ¥688</option>
                                    <option value="年卡">年卡 - ¥2888</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>新到期日期</label>
                                <input type="date" class="form-control" name="newExpireDate" id="renew-expire" required>
                            </div>
                            <div class="form-group">
                                <label>支付金额</label>
                                <input type="number" class="form-control" name="amount" id="renew-amount" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('renew-member-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.processRenew(${id})">确认续费</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        this.updateRenewExpire('月卡', member.expireDate);
    },

    updateRenewExpire(type, currentExpire) {
        const prices = { '月卡': 288, '季卡': 688, '年卡': 2888 };
        document.getElementById('renew-amount').value = prices[type] || 0;
        
        const currentDate = new Date(currentExpire);
        const now = new Date();
        const startDate = currentDate > now ? currentDate : now;
        
        if (type === '年卡') {
            startDate.setFullYear(startDate.getFullYear() + 1);
        } else if (type === '季卡') {
            startDate.setMonth(startDate.getMonth() + 3);
        } else {
            startDate.setMonth(startDate.getMonth() + 1);
        }
        
        document.getElementById('renew-expire').value = startDate.toISOString().split('T')[0];
    },

    processRenew(id) {
        const form = document.getElementById('renew-form');
        const formData = new FormData(form);
        const member = DataStore.getById('members', id);
        
        DataStore.update('members', id, {
            expireDate: formData.get('newExpireDate'),
            status: 'active'
        });
        
        DataStore.add('transactions', {
            memberId: id,
            memberName: member.name,
            type: 'membership',
            amount: parseInt(formData.get('amount')),
            date: new Date().toISOString().split('T')[0],
            description: `${formData.get('renewType')}续费`
        });
        
        document.getElementById('renew-member-modal').remove();
        this.showToast('续费成功！');
        this.renderPage();
    },

    viewMemberHistory(id) {
        const member = DataStore.getById('members', id);
        const checkIns = DataStore.query('checkIns', c => c.memberId === id);
        const transactions = DataStore.query('transactions', t => t.memberId === id);
        
        const modalHtml = `
            <div class="modal active" id="member-history-modal">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">${member.name} - 消费记录</h3>
                        <button class="modal-close" onclick="document.getElementById('member-history-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="tabs">
                            <div class="tab active" onclick="App.switchHistoryTab('checkins')" id="tab-checkins">入场记录</div>
                            <div class="tab" onclick="App.switchHistoryTab('transactions')" id="tab-transactions">消费记录</div>
                        </div>
                        <div id="history-checkins">
                            ${checkIns.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">📅</div>
                                    <p>暂无入场记录</p>
                                </div>
                            ` : `
                                <div class="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>日期</th>
                                                <th>时间</th>
                                                <th>区域</th>
                                                <th>安全告知</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${checkIns.slice(-20).reverse().map(c => `
                                                <tr>
                                                    <td>${c.date}</td>
                                                    <td>${c.time}</td>
                                                    <td>${c.wallType}</td>
                                                    <td>
                                                        <span class="badge ${c.hasSafetyBriefing ? 'badge-active' : 'badge-expired'}">
                                                            ${c.hasSafetyBriefing ? '已确认' : '未确认'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                        </div>
                        <div id="history-transactions" style="display: none;">
                            ${transactions.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">💰</div>
                                    <p>暂无消费记录</p>
                                </div>
                            ` : `
                                <div class="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>日期</th>
                                                <th>类型</th>
                                                <th>描述</th>
                                                <th>金额</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${transactions.slice(-20).reverse().map(t => `
                                                <tr>
                                                    <td>${t.date}</td>
                                                    <td>${this.getTransactionTypeName(t.type)}</td>
                                                    <td>${t.description}</td>
                                                    <td style="color: #38a169; font-weight: 600;">¥${t.amount}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin-top: 16px; text-align: right; font-weight: 600;">
                                    总消费: ¥${transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()}
                                </div>
                            `}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('member-history-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    switchHistoryTab(tab) {
        document.querySelectorAll('#member-history-modal .tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        document.getElementById('history-checkins').style.display = tab === 'checkins' ? 'block' : 'none';
        document.getElementById('history-transactions').style.display = tab === 'transactions' ? 'block' : 'none';
    },

    getTransactionTypeName(type) {
        const names = {
            membership: '会员费',
            course: '课程费',
            equipment: '装备租赁',
            event: '赛事活动',
            shop: '商店消费'
        };
        return names[type] || type;
    },

    renderCourses() {
        const coaches = DataStore.getAll('coaches');
        const courses = DataStore.getAll('courses');
        const bookings = DataStore.getAll('courseBookings');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">👨‍🏫 教练课程</h2>
                    <p class="page-subtitle">管理教练团队和私教课程</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="App.showModal('add-coach-modal')">
                        <span>+</span> 新增教练
                    </button>
                    <button class="btn btn-primary" onclick="App.showModal('add-course-modal')">
                        <span>+</span> 新增课程
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👨‍🏫</div>
                    <div class="stat-info">
                        <h3>教练人数</h3>
                        <p>${coaches.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">📚</div>
                    <div class="stat-info">
                        <h3>课程数量</h3>
                        <p>${courses.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>已预约课程</h3>
                        <p>${bookings.filter(b => b.status === 'confirmed').length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">💰</div>
                    <div class="stat-info">
                        <h3>课程收入</h3>
                        <p>¥${bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => {
                            const course = DataStore.getById('courses', b.courseId);
                            return s + (course ? course.price : 0);
                        }, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">👥 教练团队</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>教练</th>
                                    <th>等级</th>
                                    <th>专长</th>
                                    <th>经验</th>
                                    <th>评分</th>
                                    <th>电话</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${coaches.map(coach => {
                                    const coachCourses = courses.filter(c => c.coachId === coach.id);
                                    return `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div class="member-avatar">${coach.name.charAt(0)}</div>
                                                    <span>${coach.name}</span>
                                                </div>
                                            </td>
                                            <td>${coach.level}</td>
                                            <td>${coach.specialty}</td>
                                            <td>${coach.experience}</td>
                                            <td>
                                                <span class="rating">★ ${coach.rating}</span>
                                            </td>
                                            <td>${coach.phone}</td>
                                            <td><span class="badge badge-${coach.status}">${coach.status === 'active' ? '在职' : '离职'}</span></td>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn btn-sm btn-primary" onclick="App.viewCoachCourses(${coach.id})">课程</button>
                                                    <button class="btn btn-sm btn-secondary" onclick="App.editCoach(${coach.id})">编辑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📚 课程列表</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" class="form-control" placeholder="搜索课程..." id="course-search" oninput="App.filterCourses()">
                        </div>
                        <select class="form-control" id="filter-course-type" onchange="App.filterCourses()">
                            <option value="">所有类型</option>
                            <option value="private">私教课</option>
                            <option value="group">团体课</option>
                        </select>
                        <select class="form-control" id="filter-course-level" onchange="App.filterCourses()">
                            <option value="">所有难度</option>
                            <option value="beginner">入门</option>
                            <option value="intermediate">进阶</option>
                            <option value="advanced">高级</option>
                        </select>
                    </div>
                    <div id="courses-list">
                        ${this.renderCoursesList(courses)}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📅 课程预约</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>会员</th>
                                    <th>课程名称</th>
                                    <th>教练</th>
                                    <th>日期</th>
                                    <th>时间</th>
                                    <th>状态</th>
                                    <th>支付</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(() => {
                                    const statusNames = { pending: '待确认', confirmed: '已确认', cancelled: '已取消' };
                                    const paymentNames = { unpaid: '待支付', paid: '已支付', refunded: '已退款' };
                                    if (bookings.length === 0) {
                                        return `
                                            <tr>
                                                <td colspan="8">
                                                    <div class="empty-state">
                                                        <div class="empty-icon">📅</div>
                                                        <p>暂无预约记录</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }
                                    return bookings.map(booking => `
                                        <tr>
                                            <td>${booking.memberName}</td>
                                            <td>${booking.courseName}</td>
                                            <td>${DataStore.getById('courses', booking.courseId)?.coachName || '-'}</td>
                                            <td>${booking.date}</td>
                                            <td>${booking.time}</td>
                                            <td><span class="badge badge-${booking.status}">${statusNames[booking.status] || booking.status}</span></td>
                                            <td><span class="badge badge-${booking.paymentStatus}">${paymentNames[booking.paymentStatus] || booking.paymentStatus}</span></td>
                                            <td>
                                                <div class="action-buttons">
                                                    ${booking.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="App.confirmBooking(${booking.id})">确认</button>` : ''}
                                                    ${booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' ? `<button class="btn btn-sm btn-primary" onclick="App.markBookingPaid(${booking.id})">收款</button>` : ''}
                                                    ${booking.status !== 'cancelled' ? `<button class="btn btn-sm btn-danger" onclick="App.cancelBooking(${booking.id})">取消</button>` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('');
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-coach-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增教练</h3>
                        <button class="modal-close" onclick="App.hideModal('add-coach-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="coach-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>等级</label>
                                    <select class="form-control" name="level" required>
                                        <option>初级教练</option>
                                        <option>中级教练</option>
                                        <option>高级教练</option>
                                        <option>国家级教练</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>经验</label>
                                    <input type="text" class="form-control" name="experience" placeholder="如: 5年" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>专长</label>
                                <input type="text" class="form-control" name="specialty" placeholder="如: 攀岩入门、竞技提升" required>
                            </div>
                            <div class="form-group">
                                <label>电话</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-coach-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveCoach()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-course-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增课程</h3>
                        <button class="modal-close" onclick="App.hideModal('add-course-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="course-form">
                            <div class="form-group">
                                <label>课程名称</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>授课教练</label>
                                    <select class="form-control" name="coachId" required>
                                        ${coaches.filter(c => c.status === 'active').map(c => `<option value="${c.id}">${c.name} - ${c.level}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>课程类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="private">私教课</option>
                                        <option value="group">团体课</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>难度等级</label>
                                    <select class="form-control" name="level" required>
                                        <option value="beginner">入门</option>
                                        <option value="intermediate">进阶</option>
                                        <option value="advanced">高级</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>时长</label>
                                    <input type="text" class="form-control" name="duration" placeholder="如: 90分钟" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>价格(元)</label>
                                    <input type="number" class="form-control" name="price" required>
                                </div>
                                <div class="form-group">
                                    <label>最大人数</label>
                                    <input type="number" class="form-control" name="maxStudents" value="1" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>上课时间</label>
                                <input type="text" class="form-control" name="schedule" placeholder="如: 周一至周五 10:00-20:00" required>
                            </div>
                            <div class="form-group">
                                <label>课程描述</label>
                                <textarea class="form-control" name="description" rows="3" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-course-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveCourse()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="booking-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">预约课程</h3>
                        <button class="modal-close" onclick="App.hideModal('booking-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="booking-form">
                            <input type="hidden" name="courseId" id="booking-course-id">
                            <div class="form-group">
                                <label>课程</label>
                                <input type="text" class="form-control" id="booking-course-name" readonly>
                            </div>
                            <div class="form-group">
                                <label>选择会员</label>
                                <select class="form-control" name="memberId" required>
                                    <option value="">请选择会员...</option>
                                    ${DataStore.getAll('members').filter(m => m.status === 'active').map(m => 
                                        `<option value="${m.id}">${m.name} - ${m.phone}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>预约日期</label>
                                    <input type="date" class="form-control" name="date" required>
                                </div>
                                <div class="form-group">
                                    <label>预约时间</label>
                                    <input type="time" class="form-control" name="time" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('booking-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveBooking()">确认预约</button>
                    </div>
                </div>
            </div>
        `;
    },

    initCourses() {
    },

    renderCoursesList(courses) {
        if (courses.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <p>暂无课程数据</p>
                </div>
            `;
        }

        const typeNames = { private: '私教课', group: '团体课' };
        const levelNames = { beginner: '入门', intermediate: '进阶', advanced: '高级' };

        return `
            <div class="equipment-grid">
                ${courses.map(course => `
                    <div class="equipment-card">
                        <div class="equipment-header">
                            <span class="equipment-name">${course.name}</span>
                            <span class="equipment-type">${typeNames[course.type]}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-bottom: 8px;">
                            教练: ${course.coachName}
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-bottom: 8px;">
                            ${levelNames[course.level.trim()]} · ${course.duration}
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-bottom: 8px;">
                            ${course.schedule}
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-bottom: 12px;">
                            ${course.description}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #e53e3e;">¥${course.price}</div>
                            <button class="btn btn-sm btn-primary" onclick="App.showBookingModal(${course.id}, '${course.name}')">预约</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    filterCourses() {
        const search = document.getElementById('course-search').value.toLowerCase();
        const type = document.getElementById('filter-course-type').value;
        const level = document.getElementById('filter-course-level').value;
        
        let courses = DataStore.getAll('courses');
        
        if (search) {
            courses = courses.filter(c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));
        }
        if (type) {
            courses = courses.filter(c => c.type === type);
        }
        if (level) {
            courses = courses.filter(c => c.level.trim() === level);
        }
        
        document.getElementById('courses-list').innerHTML = this.renderCoursesList(courses);
    },

    saveCoach() {
        const form = document.getElementById('coach-form');
        const formData = new FormData(form);
        
        const coach = {
            name: formData.get('name'),
            level: formData.get('level'),
            experience: formData.get('experience'),
            specialty: formData.get('specialty'),
            phone: formData.get('phone'),
            status: 'active',
            rating: 5.0
        };
        
        DataStore.add('coaches', coach);
        this.hideModal('add-coach-modal');
        this.showToast('教练添加成功！');
        this.renderPage();
    },

    editCoach(id) {
        const coach = DataStore.getById('coaches', id);
        if (!coach) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-coach-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑教练</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-coach-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-coach-form">
                            <div class="form-group">
                                <label>姓名</label>
                                <input type="text" class="form-control" name="name" value="${coach.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>等级</label>
                                    <select class="form-control" name="level" required>
                                        <option ${coach.level === '初级教练' ? 'selected' : ''}>初级教练</option>
                                        <option ${coach.level === '中级教练' ? 'selected' : ''}>中级教练</option>
                                        <option ${coach.level === '高级教练' ? 'selected' : ''}>高级教练</option>
                                        <option ${coach.level === '国家级教练' ? 'selected' : ''}>国家级教练</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>经验</label>
                                    <input type="text" class="form-control" name="experience" value="${coach.experience}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>专长</label>
                                <input type="text" class="form-control" name="specialty" value="${coach.specialty}" required>
                            </div>
                            <div class="form-group">
                                <label>电话</label>
                                <input type="tel" class="form-control" name="phone" value="${coach.phone}" required>
                            </div>
                            <div class="form-group">
                                <label>状态</label>
                                <select class="form-control" name="status" required>
                                    <option value="active" ${coach.status === 'active' ? 'selected' : ''}>在职</option>
                                    <option value="inactive" ${coach.status === 'inactive' ? 'selected' : ''}>离职</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-coach-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateCoach(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateCoach(id) {
        const form = document.getElementById('edit-coach-form');
        const formData = new FormData(form);
        
        DataStore.update('coaches', id, {
            name: formData.get('name'),
            level: formData.get('level'),
            experience: formData.get('experience'),
            specialty: formData.get('specialty'),
            phone: formData.get('phone'),
            status: formData.get('status')
        });
        
        document.getElementById('edit-coach-modal').remove();
        this.showToast('教练信息更新成功！');
        this.renderPage();
    },

    viewCoachCourses(coachId) {
        const coach = DataStore.getById('coaches', coachId);
        const courses = DataStore.query('courses', c => c.coachId === coachId);
        
        const modalHtml = `
            <div class="modal active" id="coach-courses-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${coach ? coach.name : ''} 的课程</h3>
                        <button class="modal-close" onclick="document.getElementById('coach-courses-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        ${this.renderCoursesList(courses)}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('coach-courses-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    saveCourse() {
        const form = document.getElementById('course-form');
        const formData = new FormData(form);
        const coachId = parseInt(formData.get('coachId'));
        const coach = DataStore.getById('coaches', coachId);
        
        const course = {
            name: formData.get('name'),
            coachId: coachId,
            coachName: coach ? coach.name : '',
            type: formData.get('type'),
            level: formData.get('level'),
            duration: formData.get('duration'),
            price: parseInt(formData.get('price')),
            schedule: formData.get('schedule'),
            maxStudents: parseInt(formData.get('maxStudents')),
            description: formData.get('description'),
            status: 'available'
        };
        
        DataStore.add('courses', course);
        this.hideModal('add-course-modal');
        this.showToast('课程创建成功！');
        this.renderPage();
    },

    showBookingModal(courseId, courseName) {
        document.getElementById('booking-course-id').value = courseId;
        document.getElementById('booking-course-name').value = courseName;
        this.showModal('booking-modal');
    },

    refreshCoursesPage() {
        const coaches = DataStore.getAll('coaches');
        const courses = DataStore.getAll('courses');
        const bookings = DataStore.getAll('courseBookings');

        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-info p').textContent = coaches.length;
            statCards[1].querySelector('.stat-info p').textContent = courses.length;
            statCards[2].querySelector('.stat-info p').textContent = bookings.filter(b => b.status === 'confirmed').length;
            statCards[3].querySelector('.stat-info p').textContent = '¥' + bookings
                .filter(b => b.paymentStatus === 'paid')
                .reduce((s, b) => {
                    const course = DataStore.getById('courses', b.courseId);
                    return s + (course ? course.price : 0);
                }, 0).toLocaleString();
        }

        const coursesList = document.getElementById('courses-list');
        if (coursesList) {
            const search = document.getElementById('course-search')?.value.toLowerCase() || '';
            const typeFilter = document.getElementById('filter-course-type')?.value || '';
            const levelFilter = document.getElementById('filter-course-level')?.value || '';
            let filteredCourses = courses;
            if (search) filteredCourses = filteredCourses.filter(c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));
            if (typeFilter) filteredCourses = filteredCourses.filter(c => c.type === typeFilter);
            if (levelFilter) filteredCourses = filteredCourses.filter(c => c.level.trim() === levelFilter);
            coursesList.innerHTML = this.renderCoursesList(filteredCourses);
        }

        const bookingsTable = document.querySelector('.card:nth-child(4) tbody');
        if (bookingsTable) {
            if (bookings.length === 0) {
                bookingsTable.innerHTML = `
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <div class="empty-icon">📅</div>
                                <p>暂无预约记录</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                const statusNames = { pending: '待确认', confirmed: '已确认', cancelled: '已取消' };
                const paymentNames = { unpaid: '待支付', paid: '已支付', refunded: '已退款' };
                bookingsTable.innerHTML = bookings.map(booking => `
                    <tr>
                        <td>${booking.memberName}</td>
                        <td>${booking.courseName}</td>
                        <td>${DataStore.getById('courses', booking.courseId)?.coachName || '-'}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td><span class="badge badge-${booking.status}">${statusNames[booking.status] || booking.status}</span></td>
                        <td><span class="badge badge-${booking.paymentStatus}">${paymentNames[booking.paymentStatus] || booking.paymentStatus}</span></td>
                        <td>
                            <div class="action-buttons">
                                ${booking.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="App.confirmBooking(${booking.id})">确认</button>` : ''}
                                ${booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' ? `<button class="btn btn-sm btn-primary" onclick="App.markBookingPaid(${booking.id})">收款</button>` : ''}
                                ${booking.status !== 'cancelled' ? `<button class="btn btn-sm btn-danger" onclick="App.cancelBooking(${booking.id})">取消</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }
    },

    saveBooking() {
        const form = document.getElementById('booking-form');
        const formData = new FormData(form);
        const courseId = parseInt(formData.get('courseId'));
        const memberId = parseInt(formData.get('memberId'));
        
        if (!memberId) {
            this.showToast('请选择会员', 'error');
            return;
        }
        
        const course = DataStore.getById('courses', courseId);
        const member = DataStore.getById('members', memberId);
        
        const booking = {
            courseId: courseId,
            courseName: course ? course.name : '',
            memberId: memberId,
            memberName: member ? member.name : '',
            date: formData.get('date'),
            time: formData.get('time'),
            status: 'pending',
            paymentStatus: 'unpaid'
        };
        
        DataStore.add('courseBookings', booking);
        this.hideModal('booking-modal');
        this.showToast(`${member ? member.name : ''} 成功预约 ${course ? course.name : ''}！待确认和收款`);
        this.refreshCoursesPage();
    },

    confirmBooking(id) {
        DataStore.update('courseBookings', id, { status: 'confirmed' });
        this.showToast('预约已确认！');
        this.refreshCoursesPage();
    },

    markBookingPaid(id) {
        const booking = DataStore.getById('courseBookings', id);
        if (!booking || booking.paymentStatus === 'paid') return;
        
        const course = DataStore.getById('courses', booking.courseId);
        
        DataStore.update('courseBookings', id, { paymentStatus: 'paid' });
        
        DataStore.add('transactions', {
            memberId: booking.memberId,
            memberName: booking.memberName,
            type: 'course',
            amount: course ? course.price : 0,
            date: new Date().toISOString().split('T')[0],
            description: `${booking.courseName}课程费`
        });
        
        this.showToast(`${booking.memberName} 已收款 ¥${course ? course.price : 0}！`);
        this.refreshCoursesPage();
    },

    cancelBooking(id) {
        if (!confirm('确定要取消这个预约吗？已收款的将会从消费统计中扣除。')) return;
        
        const booking = DataStore.getById('courseBookings', id);
        if (!booking) return;
        
        if (booking.paymentStatus === 'paid') {
            const course = DataStore.getById('courses', booking.courseId);
            if (course) {
                DataStore.add('transactions', {
                    memberId: booking.memberId,
                    memberName: booking.memberName,
                    type: 'course',
                    amount: -course.price,
                    date: new Date().toISOString().split('T')[0],
                    description: `${booking.courseName}取消退款`
                });
            }
            DataStore.update('courseBookings', id, { status: 'cancelled', paymentStatus: 'refunded' });
        } else {
            DataStore.update('courseBookings', id, { status: 'cancelled', paymentStatus: 'refunded' });
        }
        
        this.showToast('预约已取消');
        this.refreshCoursesPage();
    },

    renderEquipment() {
        const equipment = DataStore.getAll('equipment');
        const rentals = DataStore.getAll('equipmentRentals');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🎒 装备租赁</h2>
                    <p class="page-subtitle">管理攀岩装备租赁业务</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="App.showModal('add-equipment-modal')">
                        <span>+</span> 新增装备
                    </button>
                    <button class="btn btn-primary" onclick="App.showModal('rent-equipment-modal')">
                        <span>📋</span> 装备出借
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">🎒</div>
                    <div class="stat-info">
                        <h3>装备总数</h3>
                        <p>${equipment.reduce((s, e) => s + e.total, 0)}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>可用数量</h3>
                        <p>${equipment.reduce((s, e) => s + e.available, 0)}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🔄</div>
                    <div class="stat-info">
                        <h3>已出借</h3>
                        <p>${rentals.filter(r => r.status === 'rented').length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">💰</div>
                    <div class="stat-info">
                        <h3>租赁收入</h3>
                        <p>¥${rentals.reduce((s, r) => s + r.rentFee, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📦 装备库存</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <select class="form-control" id="filter-equipment-type" onchange="App.filterEquipment()">
                            <option value="">所有类型</option>
                            <option value="harness">安全带</option>
                            <option value="shoes">攀岩鞋</option>
                            <option value="chalk_bag">镁粉袋</option>
                            <option value="helmet">头盔</option>
                        </select>
                        <select class="form-control" id="filter-equipment-size" onchange="App.filterEquipment()">
                            <option value="">所有尺码</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                        </select>
                    </div>
                    <div id="equipment-list">
                        ${this.renderEquipmentList(equipment)}
                    </div>
                </div>
            </div>

            <div class="card" style="border-left: 4px solid #ed8936;">
                <div class="card-header">
                    <h3 class="card-title">⚠️ 未归还装备提醒 (${rentals.filter(r => r.status === 'rented').length})</h3>
                </div>
                <div class="card-body" id="unreturned-list" style="padding: 0;">
                    ${rentals.filter(r => r.status === 'rented').length === 0 ? `
                        <div class="empty-state" style="padding: 20px;">
                            <div class="empty-icon">✅</div>
                            <p>所有装备已归还</p>
                        </div>
                    ` : (() => {
                        const today = new Date();
                        return rentals.filter(r => r.status === 'rented').map(r => {
                            const rentDT = new Date(`${r.rentDate}T${r.rentTime || '00:00'}:00`);
                            const hoursDiff = Math.round((today - rentDT) / (1000 * 60 * 60));
                            const daysDiff = Math.floor(hoursDiff / 24);
                            const timeStr = daysDiff > 0 ? `${daysDiff}天${hoursDiff % 24}小时` : `${hoursDiff}小时`;
                            const isOverdue = daysDiff >= 3;
                            return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; background: ${isOverdue ? '#fff5f5' : 'transparent'};">
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="font-weight: 500;">${r.memberName}</div>
                                    ${isOverdue ? '<span class="badge badge-expired" style="font-size: 0.7rem;">已超时</span>' : (hoursDiff >= 24 ? '<span class="badge badge-pending" style="font-size: 0.7rem;">>24h</span>' : '')}
                                </div>
                                <div style="font-size: 0.8rem; color: #718096;">${r.equipmentName} · 出借 ${r.rentDate} ${r.rentTime}</div>
                                <div style="font-size: 0.8rem; margin-top: 4px;">
                                    <span style="color: #3182ce;">借出: ${timeStr}</span> · 
                                    <span style="color: #e53e3e;">押金: ¥${r.deposit}</span> · 
                                    <span style="color: #38a169;">租金: ¥${r.rentFee}</span>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-success" onclick="App.returnEquipment(${r.id})">
                                <span>↩</span> 归还
                            </button>
                        </div>
                            `;
                        }).join('');
                    })()}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📋 租赁记录</h3>
                    <div style="display: flex; gap: 10px;">
                        <select class="form-control" id="filter-rental-status" onchange="App.filterRentals()">
                            <option value="">全部</option>
                            <option value="rented">租借中</option>
                            <option value="returned">已归还</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>会员</th>
                                    <th>装备</th>
                                    <th>出租日期</th>
                                    <th>出租时间</th>
                                    <th>归还日期</th>
                                    <th>使用时长</th>
                                    <th>押金</th>
                                    <th>押金状态</th>
                                    <th>租金</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="rentals-list">
                                ${this.renderRentalsList(rentals)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-equipment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增装备</h3>
                        <button class="modal-close" onclick="App.hideModal('add-equipment-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="equipment-form">
                            <div class="form-group">
                                <label>装备名称</label>
                                <select class="form-control" name="name" required>
                                    <option value="安全带">安全带</option>
                                    <option value="攀岩鞋">攀岩鞋</option>
                                    <option value="镁粉袋">镁粉袋</option>
                                    <option value="头盔">头盔</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="harness">安全带</option>
                                        <option value="shoes">攀岩鞋</option>
                                        <option value="chalk_bag">镁粉袋</option>
                                        <option value="helmet">头盔</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>品牌</label>
                                    <input type="text" class="form-control" name="brand" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>尺码</label>
                                    <input type="text" class="form-control" name="size" placeholder="如: M, 42" required>
                                </div>
                                <div class="form-group">
                                    <label>库存数量</label>
                                    <input type="number" class="form-control" name="total" min="1" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>租金(元/次)</label>
                                    <input type="number" class="form-control" name="price" required>
                                </div>
                                <div class="form-group">
                                    <label>押金(元)</label>
                                    <input type="number" class="form-control" name="deposit" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-equipment-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveEquipment()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="rent-equipment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">装备出借</h3>
                        <button class="modal-close" onclick="App.hideModal('rent-equipment-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="rent-form">
                            <div class="form-group">
                                <label>选择会员</label>
                                <select class="form-control" name="memberId" required>
                                    <option value="">请选择会员...</option>
                                    ${DataStore.getAll('members').filter(m => m.status === 'active').map(m => 
                                        `<option value="${m.id}">${m.name} - ${m.phone}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>选择装备</label>
                                <select class="form-control" name="equipmentId" id="rent-equipment-select" required>
                                    <option value="">请选择装备...</option>
                                    ${equipment.filter(e => e.available > 0).map(e => 
                                        `<option value="${e.id}" data-price="${e.price}" data-deposit="${e.deposit}">${e.name}(${e.size}) - ¥${e.price}/次 - 押金¥${e.deposit}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>租金</label>
                                    <input type="number" class="form-control" name="rentFee" id="rent-fee" readonly>
                                </div>
                                <div class="form-group">
                                    <label>押金</label>
                                    <input type="number" class="form-control" name="deposit" id="rent-deposit" readonly>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('rent-equipment-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveRental()">确认出借</button>
                    </div>
                </div>
            </div>
        `;
    },

    initEquipment() {
        document.getElementById('rent-equipment-select').addEventListener('change', function() {
            const selected = this.options[this.selectedIndex];
            if (selected.value) {
                document.getElementById('rent-fee').value = selected.dataset.price;
                document.getElementById('rent-deposit').value = selected.dataset.deposit;
            }
        });
    },

    renderEquipmentList(equipment) {
        if (equipment.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🎒</div>
                    <p>暂无装备数据</p>
                </div>
            `;
        }

        const typeNames = { harness: '安全带', shoes: '攀岩鞋', chalk_bag: '镁粉袋', helmet: '头盔' };

        return `
            <div class="equipment-grid">
                ${equipment.map(item => `
                    <div class="equipment-card">
                        <div class="equipment-header">
                            <span class="equipment-name">${item.name}</span>
                            <span class="equipment-type">${typeNames[item.type]}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-bottom: 8px;">
                            品牌: ${item.brand} · 尺码: ${item.size}
                        </div>
                        <div class="equipment-stock">
                            <span>可用: <span class="stock-available">${item.available}</span></span>
                            <span class="stock-total">/ ${item.total}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                            <div style="font-size: 1rem; font-weight: 700; color: #e53e3e;">¥${item.price}/次</div>
                            <div style="font-size: 0.8rem; color: #718096;">押金 ¥${item.deposit}</div>
                        </div>
                        <div style="display: flex; gap: 6px; margin-top: 12px;">
                            <button class="btn btn-sm btn-primary" style="flex: 1;" onclick="App.editEquipment(${item.id})">编辑</button>
                            <button class="btn btn-sm btn-success" style="flex: 1;" onclick="App.quickRent(${item.id})">出借</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderRentalsList(rentals) {
        if (rentals.length === 0) {
            return `
                <tr>
                    <td colspan="12">
                        <div class="empty-state">
                            <div class="empty-icon">📋</div>
                            <p>暂无租赁记录</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        const today = new Date();
        return rentals.sort((a, b) => {
            try { return new Date(b.rentDate) - new Date(a.rentDate); } catch (e) { return 0; }
        }).map(rental => {
            const rentDate = rental.rentDate || '';
            const rentTime = rental.rentTime || '00:00';
            const deposit = rental.deposit !== undefined ? rental.deposit : 0;
            const rentFee = rental.rentFee !== undefined ? rental.rentFee : 0;
            const status = rental.status || 'returned';
            const depositRefunded = rental.depositRefunded !== undefined ? rental.depositRefunded : (status === 'returned');
            const memberName = rental.memberName || '-';
            const equipmentName = rental.equipmentName || '-';
            
            const rentDT = new Date(`${rentDate}T${rentTime}:00`);
            let timeStr = '-';
            let overdueBadge = '';
            try {
                if (rentDate) {
                    if (status === 'rented') {
                        const hoursDiff = Math.max(0, Math.round((today - rentDT) / (1000 * 60 * 60)));
                        const daysDiff = Math.floor(hoursDiff / 24);
                        timeStr = daysDiff > 0 ? `${daysDiff}天${hoursDiff % 24}h` : `${hoursDiff}h`;
                        if (daysDiff >= 3) overdueBadge = '<span class="badge badge-expired" style="font-size:0.7rem">已超时</span>';
                        else if (hoursDiff >= 24) overdueBadge = '<span class="badge badge-pending" style="font-size:0.7rem">>24h</span>';
                    } else if (rental.returnDate) {
                        const returnDT = new Date(`${rental.returnDate}T${rental.returnTime || '00:00'}:00`);
                        const hoursDiff = Math.max(0, Math.round((returnDT - rentDT) / (1000 * 60 * 60)));
                        const daysDiff = Math.floor(hoursDiff / 24);
                        timeStr = daysDiff > 0 ? `${daysDiff}天${hoursDiff % 24}h` : `${hoursDiff}h`;
                    }
                }
            } catch (e) { timeStr = '-'; }
            return `
            <tr>
                <td>${memberName}</td>
                <td>${equipmentName}</td>
                <td>${rentDate || '-'}</td>
                <td>${rentTime || '-'}</td>
                <td>${rental.returnDate || '-'}</td>
                <td>${timeStr} ${overdueBadge}</td>
                <td>¥${deposit}</td>
                <td style="${depositRefunded === false && status === 'returned' ? 'color:#e53e3e' : ''}">
                    ${status === 'rented' ? '待退还' : (depositRefunded === false ? '未退' : '已退')}
                </td>
                <td>¥${rentFee}</td>
                <td><span class="badge badge-${status}">${status === 'rented' ? '租借中' : '已归还'}</span></td>
                <td>
                    ${status === 'rented' && rental.id ? `
                        <button class="btn btn-sm btn-success" onclick="App.returnEquipment(${rental.id})">归还</button>
                    ` : '-'}
                </td>
            </tr>
        `}).join('');
    },

    filterEquipment() {
        const type = document.getElementById('filter-equipment-type').value;
        const size = document.getElementById('filter-equipment-size').value;
        
        let equipment = DataStore.getAll('equipment');
        
        if (type) {
            equipment = equipment.filter(e => e.type === type);
        }
        if (size) {
            equipment = equipment.filter(e => e.size === size);
        }
        
        document.getElementById('equipment-list').innerHTML = this.renderEquipmentList(equipment);
    },

    filterRentals() {
        const status = document.getElementById('filter-rental-status').value;
        let rentals = DataStore.getAll('equipmentRentals');
        
        if (status) {
            rentals = rentals.filter(r => r.status === status);
        }
        
        document.getElementById('rentals-list').innerHTML = this.renderRentalsList(rentals);
    },

    saveEquipment() {
        const form = document.getElementById('equipment-form');
        const formData = new FormData(form);
        
        const equipment = {
            name: formData.get('name'),
            type: formData.get('type'),
            brand: formData.get('brand'),
            size: formData.get('size'),
            price: parseInt(formData.get('price')),
            deposit: parseInt(formData.get('deposit')),
            total: parseInt(formData.get('total')),
            available: parseInt(formData.get('total')),
            status: 'available'
        };
        
        DataStore.add('equipment', equipment);
        this.hideModal('add-equipment-modal');
        this.showToast('装备添加成功！');
        this.renderPage();
    },

    editEquipment(id) {
        const equipment = DataStore.getById('equipment', id);
        if (!equipment) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-equipment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑装备</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-equipment-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-equipment-form">
                            <div class="form-group">
                                <label>装备名称</label>
                                <input type="text" class="form-control" name="name" value="${equipment.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>品牌</label>
                                    <input type="text" class="form-control" name="brand" value="${equipment.brand}" required>
                                </div>
                                <div class="form-group">
                                    <label>尺码</label>
                                    <input type="text" class="form-control" name="size" value="${equipment.size}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>库存总数</label>
                                    <input type="number" class="form-control" name="total" value="${equipment.total}" required>
                                </div>
                                <div class="form-group">
                                    <label>可用数量</label>
                                    <input type="number" class="form-control" name="available" value="${equipment.available}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>租金(元/次)</label>
                                    <input type="number" class="form-control" name="price" value="${equipment.price}" required>
                                </div>
                                <div class="form-group">
                                    <label>押金(元)</label>
                                    <input type="number" class="form-control" name="deposit" value="${equipment.deposit}" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-equipment-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateEquipment(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateEquipment(id) {
        const form = document.getElementById('edit-equipment-form');
        const formData = new FormData(form);
        
        DataStore.update('equipment', id, {
            name: formData.get('name'),
            brand: formData.get('brand'),
            size: formData.get('size'),
            total: parseInt(formData.get('total')),
            available: parseInt(formData.get('available')),
            price: parseInt(formData.get('price')),
            deposit: parseInt(formData.get('deposit'))
        });
        
        document.getElementById('edit-equipment-modal').remove();
        this.showToast('装备信息更新成功！');
        this.filterEquipment();
    },

    quickRent(equipmentId) {
        document.getElementById('rent-equipment-select').value = equipmentId;
        const select = document.getElementById('rent-equipment-select');
        const selected = select.options[select.selectedIndex];
        if (selected) {
            document.getElementById('rent-fee').value = selected.dataset.price;
            document.getElementById('rent-deposit').value = selected.dataset.deposit;
        }
        this.showModal('rent-equipment-modal');
    },

    refreshEquipmentPage() {
        const equipment = DataStore.getAll('equipment');
        const rentals = DataStore.getAll('equipmentRentals');
        const rentedRentals = rentals.filter(r => r.status === 'rented');

        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-info p').textContent = equipment.reduce((s, e) => s + e.total, 0);
            statCards[1].querySelector('.stat-info p').textContent = equipment.reduce((s, e) => s + e.available, 0);
            statCards[2].querySelector('.stat-info p').textContent = rentedRentals.length;
            statCards[3].querySelector('.stat-info p').textContent = '¥' + rentals.reduce((s, r) => s + r.rentFee, 0).toLocaleString();
        }

        const equipmentList = document.getElementById('equipment-list');
        if (equipmentList) {
            const typeFilter = document.getElementById('filter-equipment-type')?.value || '';
            const sizeFilter = document.getElementById('filter-equipment-size')?.value || '';
            let filteredEquipment = equipment;
            if (typeFilter) filteredEquipment = filteredEquipment.filter(e => e.type === typeFilter);
            if (sizeFilter) filteredEquipment = filteredEquipment.filter(e => e.size === sizeFilter);
            equipmentList.innerHTML = this.renderEquipmentList(filteredEquipment);
        }

        const rentalsList = document.getElementById('rentals-list');
        if (rentalsList) {
            const statusFilter = document.getElementById('filter-rental-status')?.value || '';
            let filteredRentals = rentals;
            if (statusFilter) filteredRentals = filteredRentals.filter(r => r.status === statusFilter);
            rentalsList.innerHTML = this.renderRentalsList(filteredRentals);
        }

        const unreturnedList = document.getElementById('unreturned-list');
        if (unreturnedList) {
            if (rentedRentals.length === 0) {
                unreturnedList.innerHTML = `
                    <div class="empty-state" style="padding: 20px;">
                        <div class="empty-icon">✅</div>
                        <p>所有装备已归还</p>
                    </div>
                `;
            } else {
                const today = new Date();
                unreturnedList.innerHTML = rentedRentals.map(r => {
                    const rentDT = new Date(`${r.rentDate}T${r.rentTime || '00:00'}:00`);
                    const hoursDiff = Math.round((today - rentDT) / (1000 * 60 * 60));
                    const daysDiff = Math.floor(hoursDiff / 24);
                    const timeStr = daysDiff > 0 ? `${daysDiff}天${hoursDiff % 24}小时` : `${hoursDiff}小时`;
                    const isOverdue = daysDiff >= 3;
                    return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; background: ${isOverdue ? '#fff5f5' : 'transparent'};">
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-weight: 500;">${r.memberName}</div>
                                ${isOverdue ? '<span class="badge badge-expired" style="font-size: 0.7rem;">已超时</span>' : (hoursDiff >= 24 ? '<span class="badge badge-pending" style="font-size: 0.7rem;">>24h</span>' : '')}
                            </div>
                            <div style="font-size: 0.8rem; color: #718096;">${r.equipmentName} · 出借 ${r.rentDate} ${r.rentTime}</div>
                            <div style="font-size: 0.8rem; margin-top: 4px;">
                                <span style="color: #3182ce;">借出: ${timeStr}</span> · 
                                <span style="color: #e53e3e;">押金: ¥${r.deposit}</span> · 
                                <span style="color: #38a169;">租金: ¥${r.rentFee}</span>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-success" onclick="App.returnEquipment(${r.id})">归还</button>
                    </div>
                    `;
                }).join('');
            }
        }
    },

    saveRental() {
        const form = document.getElementById('rent-form');
        const formData = new FormData(form);
        const equipmentId = parseInt(formData.get('equipmentId'));
        const memberId = parseInt(formData.get('memberId'));
        
        if (!memberId || !equipmentId) {
            this.showToast('请选择会员和装备', 'error');
            return;
        }
        
        const equipment = DataStore.getById('equipment', equipmentId);
        const member = DataStore.getById('members', memberId);
        
        if (!equipment || equipment.available <= 0) {
            this.showToast('该装备库存不足', 'error');
            return;
        }
        
        const now = new Date();
        const deposit = parseInt(formData.get('deposit'));
        const rentFee = parseInt(formData.get('rentFee'));
        const rental = {
            memberId: memberId,
            memberName: member ? member.name : '',
            equipmentId: equipmentId,
            equipmentName: `${equipment.name}(${equipment.size})`,
            rentDate: now.toISOString().split('T')[0],
            rentTime: now.toTimeString().slice(0, 5),
            returnDate: null,
            returnTime: null,
            deposit: deposit,
            rentFee: rentFee,
            status: 'rented',
            depositRefunded: false
        };
        
        DataStore.add('equipmentRentals', rental);
        DataStore.update('equipment', equipmentId, { available: equipment.available - 1 });
        
        const todayStr = now.toISOString().split('T')[0];
        DataStore.add('transactions', {
            memberId: memberId,
            memberName: member ? member.name : '',
            type: 'equipment',
            amount: rentFee,
            date: todayStr,
            description: `${equipment.name}(${equipment.size})租金收入`
        });
        if (deposit > 0) {
            DataStore.add('transactions', {
                memberId: memberId,
                memberName: member ? member.name : '',
                type: 'deposit',
                amount: deposit,
                date: todayStr,
                description: `${equipment.name}(${equipment.size})押金收取`
            });
        }
        
        this.hideModal('rent-equipment-modal');
        this.showToast(`${member ? member.name : ''} 出借成功！租金¥${rentFee}${deposit > 0 ? `，押金¥${deposit}` : ''}`);
        this.refreshEquipmentPage();
    },

    returnEquipment(rentalId) {
        const rental = DataStore.getById('equipmentRentals', rentalId);
        if (!rental) return;
        
        const equipment = DataStore.getById('equipment', rental.equipmentId);
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        DataStore.update('equipmentRentals', rentalId, {
            returnDate: todayStr,
            returnTime: now.toTimeString().slice(0, 5),
            status: 'returned',
            depositRefunded: true
        });
        
        if (equipment) {
            DataStore.update('equipment', rental.equipmentId, { available: equipment.available + 1 });
        }
        
        if (rental.deposit > 0) {
            DataStore.add('transactions', {
                memberId: rental.memberId,
                memberName: rental.memberName,
                type: 'deposit',
                amount: -rental.deposit,
                date: todayStr,
                description: `${rental.equipmentName}押金退还`
            });
        }
        
        this.showToast(`${rental.memberName} 已归还！租金¥${rental.rentFee}${rental.deposit > 0 ? `，押金¥${rental.deposit}已退还` : ''}`);
        this.refreshEquipmentPage();
    },

    renderEvents() {
        const events = DataStore.getAll('events');
        const registrations = DataStore.getAll('eventRegistrations');

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🏆 赛事活动</h2>
                    <p class="page-subtitle">管理攀岩考级、赛事和安全培训</p>
                </div>
                <button class="btn btn-primary" onclick="App.showModal('add-event-modal')">
                    <span>+</span> 新增活动
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">📋</div>
                    <div class="stat-info">
                        <h3>活动总数</h3>
                        <p>${events.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>报名中</h3>
                        <p>${events.filter(e => e.status === 'open').length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">👥</div>
                    <div class="stat-info">
                        <h3>总报名人数</h3>
                        <p>${registrations.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">💰</div>
                    <div class="stat-info">
                        <h3>活动收入</h3>
                        <p>¥${registrations.filter(r => r.paymentStatus === 'paid').reduce((s, r) => {
                            const event = DataStore.getById('events', r.eventId);
                            return s + (event ? event.price : 0);
                        }, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📅 活动列表</h3>
                    <div style="display: flex; gap: 10px;">
                        <select class="form-control" id="filter-event-type" onchange="App.filterEvents()">
                            <option value="">所有类型</option>
                            <option value="grading">攀岩考级</option>
                            <option value="competition">赛事活动</option>
                            <option value="training">安全培训</option>
                        </select>
                        <select class="form-control" id="filter-event-status" onchange="App.filterEvents()">
                            <option value="">所有状态</option>
                            <option value="open">报名中</option>
                            <option value="closed">已截止</option>
                            <option value="completed">已结束</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="events-list">
                        ${this.renderEventsList(events)}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📝 报名记录</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>会员</th>
                                    <th>活动名称</th>
                                    <th>活动类型</th>
                                    <th>报名日期</th>
                                    <th>费用</th>
                                    <th>状态</th>
                                    <th>支付</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(() => {
                                    const statusNames = { pending: '待确认', confirmed: '已确认', cancelled: '已取消' };
                                    const paymentNames = { unpaid: '待支付', paid: '已支付', refunded: '已退款' };
                                    const typeNames = { grading: '攀岩考级', competition: '赛事活动', training: '安全培训' };
                                    if (registrations.length === 0) {
                                        return `
                                            <tr>
                                                <td colspan="8">
                                                    <div class="empty-state">
                                                        <div class="empty-icon">📝</div>
                                                        <p>暂无报名记录</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }
                                    return registrations.map(reg => {
                                        const event = DataStore.getById('events', reg.eventId);
                                        return `
                                            <tr>
                                                <td>${reg.memberName}</td>
                                                <td>${reg.eventName}</td>
                                                <td>${event ? typeNames[event.type] : '-'}</td>
                                                <td>${reg.date}</td>
                                                <td>¥${event ? event.price : 0}</td>
                                                <td><span class="badge badge-${reg.status}">${statusNames[reg.status] || reg.status}</span></td>
                                                <td><span class="badge badge-${reg.paymentStatus}">${paymentNames[reg.paymentStatus] || reg.paymentStatus}</span></td>
                                                <td>
                                                    <div class="action-buttons">
                                                        ${reg.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="App.confirmRegistration(${reg.id})">确认</button>` : ''}
                                                        ${reg.paymentStatus === 'unpaid' && reg.status !== 'cancelled' && event && event.price > 0 ? `<button class="btn btn-sm btn-primary" onclick="App.markRegistrationPaid(${reg.id})">收款</button>` : ''}
                                                        ${reg.status !== 'cancelled' ? `<button class="btn btn-sm btn-danger" onclick="App.cancelRegistration(${reg.id})">取消</button>` : ''}
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('');
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal" id="add-event-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">新增活动</h3>
                        <button class="modal-close" onclick="App.hideModal('add-event-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="event-form">
                            <div class="form-group">
                                <label>活动名称</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="grading">攀岩考级</option>
                                        <option value="competition">赛事活动</option>
                                        <option value="training">安全培训</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>难度等级</label>
                                    <input type="text" class="form-control" name="level" placeholder="如: 初级、公开组" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动日期</label>
                                    <input type="date" class="form-control" name="date" required>
                                </div>
                                <div class="form-group">
                                    <label>活动时间</label>
                                    <input type="time" class="form-control" name="time" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动地点</label>
                                    <input type="text" class="form-control" name="location" required>
                                </div>
                                <div class="form-group">
                                    <label>最大人数</label>
                                    <input type="number" class="form-control" name="maxParticipants" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>报名费用(元)</label>
                                <input type="number" class="form-control" name="price" value="0" required>
                            </div>
                            <div class="form-group">
                                <label>活动描述</label>
                                <textarea class="form-control" name="description" rows="3" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('add-event-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveEvent()">保存</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="register-event-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">活动报名</h3>
                        <button class="modal-close" onclick="App.hideModal('register-event-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="register-form">
                            <input type="hidden" name="eventId" id="register-event-id">
                            <div class="form-group">
                                <label>活动</label>
                                <input type="text" class="form-control" id="register-event-name" readonly>
                            </div>
                            <div class="form-group">
                                <label>选择会员</label>
                                <select class="form-control" name="memberId" required>
                                    <option value="">请选择会员...</option>
                                    ${DataStore.getAll('members').filter(m => m.status === 'active').map(m => 
                                        `<option value="${m.id}">${m.name} - ${m.phone}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.hideModal('register-event-modal')">取消</button>
                        <button class="btn btn-primary" onclick="App.saveRegistration()">确认报名</button>
                    </div>
                </div>
            </div>
        `;
    },

    initEvents() {
    },

    renderEventsList(events) {
        if (events.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <p>暂无活动数据</p>
                </div>
            `;
        }

        const typeNames = { grading: '攀岩考级', competition: '赛事活动', training: '安全培训' };
        const typeColors = { grading: '#9B59B6', competition: '#E74C3C', training: '#3498DB' };
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

        return events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => {
            const eventDate = new Date(event.date);
            const progress = (event.registered / event.maxParticipants) * 100;
            const registrations = DataStore.query('eventRegistrations', r => r.eventId === event.id);
            
            return `
                <div class="event-card">
                    <div class="event-date" style="background: linear-gradient(135deg, ${typeColors[event.type]} 0%, ${typeColors[event.type]}cc 100%);">
                        <div class="event-day">${eventDate.getDate()}</div>
                        <div class="event-month">${months[eventDate.getMonth()]}</div>
                    </div>
                    <div class="event-content">
                        <div class="event-title">${event.name}</div>
                        <div class="event-meta">
                            <span><span class="badge" style="background: ${typeColors[event.type]}; color: white;">${typeNames[event.type]}</span></span>
                            <span>📍 ${event.location}</span>
                            <span>⏰ ${event.time}</span>
                            <span>📊 ${event.level}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: #718096; margin-top: 8px;">
                            ${event.description}
                        </div>
                        <div class="event-progress">
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                                <span>报名进度</span>
                                <span>${event.registered}/${event.maxParticipants} 人</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="event-actions">
                        <div style="text-align: right; margin-bottom: 8px;">
                            ${event.price > 0 ? `<div style="font-size: 1.1rem; font-weight: 700; color: #e53e3e;">¥${event.price}</div>` : `<div style="font-size: 0.9rem; color: #38a169; font-weight: 600;">免费</div>`}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            ${event.status === 'open' && event.registered < event.maxParticipants ? `
                                <button class="btn btn-sm btn-primary" onclick="App.showRegisterModal(${event.id}, '${event.name}')">立即报名</button>
                            ` : ''}
                            <button class="btn btn-sm btn-secondary" onclick="App.viewEventRegistrations(${event.id})">查看报名</button>
                            <button class="btn btn-sm btn-warning" onclick="App.editEvent(${event.id})">编辑</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    filterEvents() {
        const type = document.getElementById('filter-event-type').value;
        const status = document.getElementById('filter-event-status').value;
        
        let events = DataStore.getAll('events');
        
        if (type) {
            events = events.filter(e => e.type === type);
        }
        if (status) {
            events = events.filter(e => e.status === status);
        }
        
        document.getElementById('events-list').innerHTML = this.renderEventsList(events);
    },

    saveEvent() {
        const form = document.getElementById('event-form');
        const formData = new FormData(form);
        
        const event = {
            name: formData.get('name'),
            type: formData.get('type'),
            level: formData.get('level'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            maxParticipants: parseInt(formData.get('maxParticipants')),
            registered: 0,
            price: parseInt(formData.get('price')),
            description: formData.get('description'),
            status: 'open'
        };
        
        DataStore.add('events', event);
        this.hideModal('add-event-modal');
        this.showToast('活动创建成功！');
        this.renderPage();
    },

    editEvent(id) {
        const event = DataStore.getById('events', id);
        if (!event) return;
        
        const modalHtml = `
            <div class="modal active" id="edit-event-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">编辑活动</h3>
                        <button class="modal-close" onclick="document.getElementById('edit-event-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-event-form">
                            <div class="form-group">
                                <label>活动名称</label>
                                <input type="text" class="form-control" name="name" value="${event.name}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动类型</label>
                                    <select class="form-control" name="type" required>
                                        <option value="grading" ${event.type === 'grading' ? 'selected' : ''}>攀岩考级</option>
                                        <option value="competition" ${event.type === 'competition' ? 'selected' : ''}>赛事活动</option>
                                        <option value="training" ${event.type === 'training' ? 'selected' : ''}>安全培训</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>难度等级</label>
                                    <input type="text" class="form-control" name="level" value="${event.level}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动日期</label>
                                    <input type="date" class="form-control" name="date" value="${event.date}" required>
                                </div>
                                <div class="form-group">
                                    <label>活动时间</label>
                                    <input type="time" class="form-control" name="time" value="${event.time}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>活动地点</label>
                                    <input type="text" class="form-control" name="location" value="${event.location}" required>
                                </div>
                                <div class="form-group">
                                    <label>最大人数</label>
                                    <input type="number" class="form-control" name="maxParticipants" value="${event.maxParticipants}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>报名费用(元)</label>
                                <input type="number" class="form-control" name="price" value="${event.price}" required>
                            </div>
                            <div class="form-group">
                                <label>活动描述</label>
                                <textarea class="form-control" name="description" rows="3" required>${event.description}</textarea>
                            </div>
                            <div class="form-group">
                                <label>状态</label>
                                <select class="form-control" name="status" required>
                                    <option value="open" ${event.status === 'open' ? 'selected' : ''}>报名中</option>
                                    <option value="closed" ${event.status === 'closed' ? 'selected' : ''}>已截止</option>
                                    <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>已结束</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('edit-event-modal').remove()">取消</button>
                        <button class="btn btn-primary" onclick="App.updateEvent(${id})">保存</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    updateEvent(id) {
        const form = document.getElementById('edit-event-form');
        const formData = new FormData(form);
        
        DataStore.update('events', id, {
            name: formData.get('name'),
            type: formData.get('type'),
            level: formData.get('level'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            maxParticipants: parseInt(formData.get('maxParticipants')),
            price: parseInt(formData.get('price')),
            description: formData.get('description'),
            status: formData.get('status')
        });
        
        document.getElementById('edit-event-modal').remove();
        this.showToast('活动信息更新成功！');
        this.filterEvents();
    },

    showRegisterModal(eventId, eventName) {
        document.getElementById('register-event-id').value = eventId;
        document.getElementById('register-event-name').value = eventName;
        this.showModal('register-event-modal');
    },

    refreshEventsPage() {
        const events = DataStore.getAll('events');
        const registrations = DataStore.getAll('eventRegistrations');

        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-info p').textContent = events.length;
            statCards[1].querySelector('.stat-info p').textContent = events.filter(e => e.status === 'open').length;
            statCards[2].querySelector('.stat-info p').textContent = registrations.length;
            statCards[3].querySelector('.stat-info p').textContent = '¥' + registrations
                .filter(r => r.paymentStatus === 'paid')
                .reduce((s, r) => {
                    const ev = DataStore.getById('events', r.eventId);
                    return s + (ev ? ev.price : 0);
                }, 0).toLocaleString();
        }

        const eventsList = document.getElementById('events-list');
        if (eventsList) {
            const search = document.getElementById('event-search')?.value.toLowerCase() || '';
            const typeFilter = document.getElementById('filter-event-type')?.value || '';
            const statusFilter = document.getElementById('filter-event-status')?.value || '';
            let filteredEvents = events;
            if (search) filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(search) || e.description.toLowerCase().includes(search));
            if (typeFilter) filteredEvents = filteredEvents.filter(e => e.type === typeFilter);
            if (statusFilter) filteredEvents = filteredEvents.filter(e => e.status === statusFilter);
            eventsList.innerHTML = this.renderEventsList(filteredEvents);
        }

        const regTable = document.querySelector('.card:nth-child(4) tbody');
        if (regTable) {
            const statusNames = { pending: '待确认', confirmed: '已确认', cancelled: '已取消' };
            const paymentNames = { unpaid: '待支付', paid: '已支付', refunded: '已退款' };
            const typeNames = { grading: '攀岩考级', competition: '赛事活动', training: '安全培训' };
            if (registrations.length === 0) {
                regTable.innerHTML = `
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <div class="empty-icon">📝</div>
                                <p>暂无报名记录</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                regTable.innerHTML = registrations.map(reg => {
                    const ev = DataStore.getById('events', reg.eventId);
                    return `
                        <tr>
                            <td>${reg.memberName}</td>
                            <td>${reg.eventName}</td>
                            <td>${ev ? typeNames[ev.type] : '-'}</td>
                            <td>${reg.date}</td>
                            <td>¥${ev ? ev.price : 0}</td>
                            <td><span class="badge badge-${reg.status}">${statusNames[reg.status] || reg.status}</span></td>
                            <td><span class="badge badge-${reg.paymentStatus}">${paymentNames[reg.paymentStatus] || reg.paymentStatus}</span></td>
                            <td>
                                <div class="action-buttons">
                                    ${reg.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="App.confirmRegistration(${reg.id})">确认</button>` : ''}
                                    ${reg.paymentStatus === 'unpaid' && reg.status !== 'cancelled' && ev && ev.price > 0 ? `<button class="btn btn-sm btn-primary" onclick="App.markRegistrationPaid(${reg.id})">收款</button>` : ''}
                                    ${reg.status !== 'cancelled' ? `<button class="btn btn-sm btn-danger" onclick="App.cancelRegistration(${reg.id})">取消</button>` : ''}
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    },

    saveRegistration() {
        const form = document.getElementById('register-form');
        const formData = new FormData(form);
        const eventId = parseInt(formData.get('eventId'));
        const memberId = parseInt(formData.get('memberId'));
        
        if (!memberId) {
            this.showToast('请选择会员', 'error');
            return;
        }
        
        const event = DataStore.getById('events', eventId);
        const member = DataStore.getById('members', memberId);
        
        if (!event || event.registered >= event.maxParticipants) {
            this.showToast('该活动已满员', 'error');
            return;
        }
        
        const existing = DataStore.query('eventRegistrations', r => r.eventId === eventId && r.memberId === memberId);
        if (existing.length > 0) {
            this.showToast('该会员已报名此活动', 'error');
            return;
        }
        
        const registration = {
            eventId: eventId,
            eventName: event ? event.name : '',
            memberId: memberId,
            memberName: member ? member.name : '',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            paymentStatus: event && event.price > 0 ? 'unpaid' : 'paid'
        };
        
        DataStore.add('eventRegistrations', registration);
        DataStore.update('events', eventId, { registered: event.registered + 1 });
        
        this.hideModal('register-event-modal');
        this.showToast(`${member ? member.name : ''} 报名 ${event ? event.name : ''} 成功！${event && event.price > 0 ? '待收款' : ''}`);
        this.refreshEventsPage();
    },

    confirmRegistration(id) {
        DataStore.update('eventRegistrations', id, { status: 'confirmed' });
        this.showToast('报名已确认！');
        this.refreshEventsPage();
    },

    markRegistrationPaid(id) {
        const reg = DataStore.getById('eventRegistrations', id);
        if (!reg || reg.paymentStatus === 'paid') return;
        
        const event = DataStore.getById('events', reg.eventId);
        
        DataStore.update('eventRegistrations', id, { paymentStatus: 'paid' });
        
        if (event && event.price > 0) {
            DataStore.add('transactions', {
                memberId: reg.memberId,
                memberName: reg.memberName,
                type: 'event',
                amount: event.price,
                date: new Date().toISOString().split('T')[0],
                description: `${event.name}报名费`
            });
        }
        
        this.showToast(`${reg.memberName} 已收款 ¥${event ? event.price : 0}！`);
        this.refreshEventsPage();
    },

    cancelRegistration(id) {
        if (!confirm('确定要取消这个报名吗？已收款的将会从消费统计中扣除，名额将释放。')) return;
        
        const reg = DataStore.getById('eventRegistrations', id);
        if (!reg) return;
        const event = DataStore.getById('events', reg.eventId);
        
        if (reg.paymentStatus === 'paid' && event) {
            DataStore.add('transactions', {
                memberId: reg.memberId,
                memberName: reg.memberName,
                type: 'event',
                amount: -event.price,
                date: new Date().toISOString().split('T')[0],
                description: `${event.name}取消退款`
            });
            DataStore.update('eventRegistrations', id, { status: 'cancelled', paymentStatus: 'refunded' });
        } else {
            DataStore.update('eventRegistrations', id, { status: 'cancelled', paymentStatus: 'refunded' });
        }
        
        if (event) {
            DataStore.update('events', reg.eventId, { registered: Math.max(0, event.registered - 1) });
        }
        
        this.showToast('报名已取消，名额已释放');
        this.refreshEventsPage();
    },

    viewEventRegistrations(eventId) {
        const event = DataStore.getById('events', eventId);
        const registrations = DataStore.query('eventRegistrations', r => r.eventId === eventId);
        
        const modalHtml = `
            <div class="modal active" id="event-registrations-modal">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 class="modal-title">${event ? event.name : ''} - 报名列表</h3>
                        <button class="modal-close" onclick="document.getElementById('event-registrations-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <p style="margin-bottom: 16px;">已报名: ${registrations.length}/${event ? event.maxParticipants : 0} 人</p>
                        ${registrations.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">📝</div>
                                <p>暂无报名记录</p>
                            </div>
                        ` : `
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>会员姓名</th>
                                            <th>报名日期</th>
                                            <th>状态</th>
                                            <th>支付</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${registrations.map(reg => `
                                            <tr>
                                                <td>${reg.memberName}</td>
                                                <td>${reg.date}</td>
                                                <td><span class="badge badge-${reg.status}">${reg.status === 'confirmed' ? '已确认' : '待确认'}</span></td>
                                                <td><span class="badge badge-${reg.paymentStatus}">${reg.paymentStatus === 'paid' ? '已支付' : '待支付'}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="document.getElementById('event-registrations-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    renderStatistics() {
        try {
        const transactions = DataStore.getAll('transactions');
        const members = DataStore.getAll('members');
        const checkIns = DataStore.getAll('checkIns');
        const courses = DataStore.getAll('courses');
        const events = DataStore.getAll('events');
        const bookings = DataStore.getAll('courseBookings');

        const businessTransactions = transactions.filter(t => t.type !== 'deposit');
        const totalRevenue = businessTransactions.reduce((s, t) => s + t.amount, 0);
        const paidAmount = businessTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const refundAmount = Math.abs(businessTransactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
        const unpaidBookings = bookings.filter(b => b.paymentStatus === 'unpaid' && b.status !== 'cancelled');
        const unpaidRegs = DataStore.getAll('eventRegistrations').filter(r => r.paymentStatus === 'unpaid' && r.status !== 'cancelled');
        let pendingAmount = 0;
        unpaidBookings.forEach(b => {
            const c = DataStore.getById('courses', b.courseId);
            if (c) pendingAmount += c.price;
        });
        unpaidRegs.forEach(r => {
            const ev = DataStore.getById('events', r.eventId);
            if (ev) pendingAmount += ev.price;
        });
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyRevenue = transactions
            .filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((s, t) => s + t.amount, 0);

        const revenueByType = {
            membership: transactions.filter(t => t.type === 'membership').reduce((s, t) => s + t.amount, 0),
            course: transactions.filter(t => t.type === 'course').reduce((s, t) => s + t.amount, 0),
            equipment: transactions.filter(t => t.type === 'equipment').reduce((s, t) => s + t.amount, 0),
            event: transactions.filter(t => t.type === 'event').reduce((s, t) => s + t.amount, 0),
            shop: transactions.filter(t => t.type === 'shop').reduce((s, t) => s + t.amount, 0),
            deposit: transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0)
        };

        const memberSpending = {};
        businessTransactions.forEach(t => {
            if (!memberSpending[t.memberId]) {
                memberSpending[t.memberId] = { name: t.memberName, total: 0 };
            }
            memberSpending[t.memberId].total += t.amount;
        });
        const topSpenders = Object.values(memberSpending)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const typeNames = { membership: '会员费', course: '课程费', equipment: '装备租赁', event: '赛事活动', shop: '商店消费', deposit: '押金往来' };
        const colors = { membership: '#3182ce', course: '#805ad5', equipment: '#38a169', event: '#dd6b20', shop: '#e53e3e', deposit: '#a0aec0' };

        const totalTypeRevenue = Object.entries(revenueByType).reduce((s, [k, v]) => s + (k === 'deposit' ? 0 : v), 0);
        let conicGradient = '';
        let currentAngle = 0;
        Object.entries(revenueByType).forEach(([type, amount]) => {
            if (type !== 'deposit' && amount > 0) {
                const angle = (amount / totalTypeRevenue) * 360;
                conicGradient += `${colors[type]} ${currentAngle}deg ${currentAngle + angle}deg, `;
                currentAngle += angle;
            }
        });
        conicGradient = conicGradient.slice(0, -2);

        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">📊 消费统计</h2>
                    <p class="page-subtitle">查看场馆运营数据和消费分析</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <select class="form-control" id="stats-time-filter" onchange="App.updateStatistics()" style="width: 130px;">
                        <option value="all">全部时间</option>
                        <option value="month">本月</option>
                        <option value="quarter">本季度</option>
                        <option value="year">本年</option>
                    </select>
                    <select class="form-control" id="stats-type-filter" onchange="App.updateStatistics()" style="width: 130px;">
                        <option value="">所有类型</option>
                        <option value="membership">会员费</option>
                        <option value="course">课程费</option>
                        <option value="equipment">装备租赁</option>
                        <option value="event">赛事活动</option>
                        <option value="shop">商店消费</option>
                        <option value="deposit">押金往来</option>
                    </select>
                    <select class="form-control" id="stats-member-filter" onchange="App.updateStatistics()" style="width: 150px;">
                        <option value="">所有会员</option>
                        ${members.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                    </select>
                    <button class="btn btn-secondary" onclick="App.exportData()">
                        <span>📥</span> 导出数据
                    </button>
                </div>
            </div>

            <div class="stats-grid" id="stats-cards">
                <div class="stat-card" id="stat-total-revenue">
                    <div class="stat-icon green">💰</div>
                    <div class="stat-info">
                        <h3>筛选后总收入</h3>
                        <p>¥${totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div class="stat-card" id="stat-transaction-count">
                    <div class="stat-icon blue">📈</div>
                    <div class="stat-info">
                        <h3>筛选后交易笔数</h3>
                        <p>${transactions.length}</p>
                    </div>
                </div>
                <div class="stat-card" id="stat-paid-amount">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <h3>实收金额</h3>
                        <p>¥${paidAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div class="stat-card" id="stat-refund-amount">
                    <div class="stat-icon red">↩</div>
                    <div class="stat-info">
                        <h3>退款金额</h3>
                        <p>¥${refundAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div class="stat-card" id="stat-pending-amount">
                    <div class="stat-icon orange">⏰</div>
                    <div class="stat-info">
                        <h3>待收款金额</h3>
                        <p>¥${pendingAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">👥</div>
                    <div class="stat-info">
                        <h3>会员总数</h3>
                        <p>${members.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">✅</div>
                    <div class="stat-info">
                        <h3>总入场人次</h3>
                        <p>${checkIns.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">📚</div>
                    <div class="stat-info">
                        <h3>课程数量</h3>
                        <p>${courses.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🏆</div>
                    <div class="stat-info">
                        <h3>活动数量</h3>
                        <p>${events.length}</p>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">🥧 收入构成分析</h3>
                    </div>
                    <div class="card-body">
                        <div id="pie-chart-container" style="display: flex; align-items: center; gap: 30px;">
                            <div id="pie-chart-circle" style="width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(${conicGradient});"></div>
                            <div style="flex: 1;" id="pie-chart-legend">
                                ${Object.entries(revenueByType).filter(([type]) => type !== 'deposit').map(([type, amount]) => `
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 12px; height: 12px; border-radius: 3px; background: ${colors[type]};"></div>
                                            <span>${typeNames[type]}</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-weight: 600;">¥${amount.toLocaleString()}</div>
                                            <div style="font-size: 0.75rem; color: #718096;">${totalTypeRevenue > 0 ? ((amount / totalTypeRevenue) * 100).toFixed(1) : 0}%</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">📊 收入类型对比</h3>
                    </div>
                    <div class="card-body" id="bar-chart-container">
                        ${(() => {
                            const nonDeposit = Object.entries(revenueByType).filter(([type]) => type !== 'deposit');
                            const maxAmount = Math.max(...nonDeposit.map(([_, v]) => v), 1);
                            return nonDeposit.map(([type, amount]) => {
                                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                                return `
                                <div style="margin-bottom: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <span>${typeNames[type]}</span>
                                        <span style="font-weight: 600;">¥${amount.toLocaleString()}</span>
                                    </div>
                                    <div style="height: 24px; background: #edf2f7; border-radius: 4px; overflow: hidden;">
                                        <div style="width: ${percentage}%; height: 100%; background: ${colors[type]}; border-radius: 4px;"></div>
                                    </div>
                                </div>
                            `;
                            }).join('');
                        })()}
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">🏆 消费排行 TOP 5</h3>
                    </div>
                    <div class="card-body" id="top-spenders-container">
                        ${topSpenders.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">🏆</div>
                                <p>暂无消费数据</p>
                            </div>
                        ` : topSpenders.map((spender, index) => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 28px; height: 28px; border-radius: 50%; background: ${index === 0 ? '#f6e05e' : index === 1 ? '#a0aec0' : index === 2 ? '#d69e2e' : '#e2e8f0'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                                        ${index + 1}
                                    </div>
                                    <div class="member-avatar">${spender.name.charAt(0)}</div>
                                    <span style="font-weight: 500;">${spender.name}</span>
                                </div>
                                <span style="font-weight: 700; color: #38a169;">¥${spender.total.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">📅 月度趋势</h3>
                    </div>
                    <div class="card-body" id="monthly-chart">
                        ${this.renderMonthlyChart(businessTransactions)}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📋 交易明细</h3>
                </div>
                <div class="card-body">
                    <div class="filter-bar">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" class="form-control" placeholder="搜索会员..." id="transaction-search" oninput="App.filterTransactions()">
                        </div>
                        <select class="form-control" id="filter-transaction-type" onchange="App.filterTransactions()">
                            <option value="">所有类型</option>
                            <option value="membership">会员费</option>
                            <option value="course">课程费</option>
                            <option value="equipment">装备租赁</option>
                            <option value="event">赛事活动</option>
                            <option value="shop">商店消费</option>
                            <option value="deposit">押金往来</option>
                        </select>
                    </div>
                    <div id="transactions-list">
                        ${this.renderTransactionsList(transactions)}
                    </div>
                </div>
            </div>
        `;
        } catch (e) {
            console.error('renderStatistics error:', e);
            return `
                <div class="page-header">
                    <h2 class="page-title">📊 消费统计</h2>
                    <p class="page-subtitle">查看场馆运营数据和消费分析</p>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <div class="empty-icon">⚠️</div>
                            <p>统计数据加载失败，请刷新页面重试</p>
                            <p style="font-size: 0.8rem; color: #718096;">${e.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    renderMonthlyChart(transactions) {
        const monthlyData = this.getMonthlyData(transactions);
        const maxValue = Math.max(...monthlyData.map(d => d.value), 1);
        
        return `
            <div style="display: flex; align-items: flex-end; gap: 8px; height: 180px; padding: 0 8px;">
                ${monthlyData.map(d => `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="font-size: 0.7rem; color: #718096; font-weight: 600;">¥${d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}</div>
                        <div style="width: 100%; background: linear-gradient(to top, #3182ce, #63b3ed); border-radius: 4px 4px 0 0; height: ${(d.value / maxValue) * 140}px; min-height: 4px;"></div>
                        <div style="font-size: 0.7rem; color: #718096;">${d.month}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getMonthlyData(transactions) {
        if (!transactions) transactions = DataStore.getAll('transactions').filter(t => t.type !== 'deposit');
        const monthlyData = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = `${date.getMonth() + 1}月`;
            
            const monthlyTotal = transactions
                .filter(t => t.date.startsWith(monthStr))
                .reduce((s, t) => s + t.amount, 0);
            
            monthlyData.push({ month: monthName, value: monthlyTotal });
        }
        
        return monthlyData;
    },

    initStatistics() {
    },

    updateStatistics() {
        try {
        const allTransactions = DataStore.getAll('transactions');
        let filtered = allTransactions;

        const timeFilter = document.getElementById('stats-time-filter')?.value || 'all';
        const typeFilter = document.getElementById('stats-type-filter')?.value || '';
        const memberFilter = document.getElementById('stats-member-filter')?.value || '';

        const detailTypeFilter = document.getElementById('filter-transaction-type')?.value || '';
        const detailSearch = document.getElementById('transaction-search')?.value.toLowerCase() || '';

        const now = new Date();
        if (timeFilter === 'month') {
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (timeFilter === 'quarter') {
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            filtered = filtered.filter(t => new Date(t.date) >= quarterStart);
        } else if (timeFilter === 'year') {
            filtered = filtered.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        }

        if (typeFilter) {
            filtered = filtered.filter(t => t.type === typeFilter);
        } else if (detailTypeFilter) {
            filtered = filtered.filter(t => t.type === detailTypeFilter);
        }
        if (memberFilter) {
            filtered = filtered.filter(t => t.memberId === parseInt(memberFilter));
        }
        if (detailSearch) {
            filtered = filtered.filter(t => 
                t.memberName && t.memberName.toLowerCase().includes(detailSearch)
            );
        }

        const typeNames = { membership: '会员费', course: '课程费', equipment: '装备租赁', event: '赛事活动', shop: '商店消费', deposit: '押金往来' };
        const colors = { membership: '#3182ce', course: '#805ad5', equipment: '#38a169', event: '#dd6b20', shop: '#e53e3e', deposit: '#a0aec0' };

        const revenueByType = {
            membership: filtered.filter(t => t.type === 'membership').reduce((s, t) => s + t.amount, 0),
            course: filtered.filter(t => t.type === 'course').reduce((s, t) => s + t.amount, 0),
            equipment: filtered.filter(t => t.type === 'equipment').reduce((s, t) => s + t.amount, 0),
            event: filtered.filter(t => t.type === 'event').reduce((s, t) => s + t.amount, 0),
            shop: filtered.filter(t => t.type === 'shop').reduce((s, t) => s + t.amount, 0),
            deposit: filtered.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0)
        };
        const businessFiltered = filtered.filter(t => t.type !== 'deposit');
        const totalRevenue = businessFiltered.reduce((s, t) => s + t.amount, 0);
        const totalTypeRevenue = Object.entries(revenueByType).reduce((s, [k, v]) => s + (k === 'deposit' ? 0 : v), 0);

        const paidAmount = businessFiltered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const refundAmount = Math.abs(businessFiltered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
        const allBookings = DataStore.getAll('courseBookings').filter(b => b.paymentStatus === 'unpaid' && b.status !== 'cancelled');
        const allRegs = DataStore.getAll('eventRegistrations').filter(r => r.paymentStatus === 'unpaid' && r.status !== 'cancelled');
        let pendingAmount = 0;
        allBookings.forEach(b => {
            const c = DataStore.getById('courses', b.courseId);
            if (c) pendingAmount += c.price;
        });
        allRegs.forEach(r => {
            const e = DataStore.getById('events', r.eventId);
            if (e) pendingAmount += e.price;
        });

        const statTotal = document.querySelector('#stat-total-revenue .stat-info p');
        if (statTotal) statTotal.textContent = '¥' + totalRevenue.toLocaleString();
        const statCount = document.querySelector('#stat-transaction-count .stat-info p');
        if (statCount) statCount.textContent = filtered.length;
        const statPaid = document.querySelector('#stat-paid-amount .stat-info p');
        if (statPaid) statPaid.textContent = '¥' + paidAmount.toLocaleString();
        const statRefund = document.querySelector('#stat-refund-amount .stat-info p');
        if (statRefund) statRefund.textContent = '¥' + refundAmount.toLocaleString();
        const statPending = document.querySelector('#stat-pending-amount .stat-info p');
        if (statPending) statPending.textContent = '¥' + pendingAmount.toLocaleString();

        let conicGradient = '';
        let currentAngle = 0;
        Object.entries(revenueByType).forEach(([type, amount]) => {
            if (type !== 'deposit' && amount > 0) {
                const angle = (amount / totalTypeRevenue) * 360;
                conicGradient += `${colors[type]} ${currentAngle}deg ${currentAngle + angle}deg, `;
                currentAngle += angle;
            }
        });
        conicGradient = conicGradient.slice(0, -2);
        const pieCircle = document.getElementById('pie-chart-circle');
        if (pieCircle) pieCircle.style.background = `conic-gradient(${conicGradient})`;
        const pieLegend = document.getElementById('pie-chart-legend');
        if (pieLegend) {
            pieLegend.innerHTML = Object.entries(revenueByType).filter(([type]) => type !== 'deposit').map(([type, amount]) => `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 12px; height: 12px; border-radius: 3px; background: ${colors[type]};"></div>
                        <span>${typeNames[type]}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600;">¥${amount.toLocaleString()}</div>
                        <div style="font-size: 0.75rem; color: #718096;">${totalTypeRevenue > 0 ? ((amount / totalTypeRevenue) * 100).toFixed(1) : 0}%</div>
                    </div>
                </div>
            `).join('');
        }

        const barChart = document.getElementById('bar-chart-container');
        if (barChart) {
            const nonDepositTypes = Object.entries(revenueByType).filter(([type]) => type !== 'deposit');
            const maxAmount = Math.max(...nonDepositTypes.map(([_, v]) => v), 1);
            barChart.innerHTML = nonDepositTypes.map(([type, amount]) => {
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                return `
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>${typeNames[type]}</span>
                            <span style="font-weight: 600;">¥${amount.toLocaleString()}</span>
                        </div>
                        <div style="height: 24px; background: #edf2f7; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: ${colors[type]}; border-radius: 4px;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        const memberSpending = {};
        businessFiltered.forEach(t => {
            if (!memberSpending[t.memberId]) {
                memberSpending[t.memberId] = { name: t.memberName, total: 0 };
            }
            memberSpending[t.memberId].total += t.amount;
        });
        const topSpenders = Object.values(memberSpending)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
        const topSpendersEl = document.getElementById('top-spenders-container');
        if (topSpendersEl) {
            if (topSpenders.length === 0) {
                topSpendersEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏆</div>
                        <p>暂无消费数据</p>
                    </div>
                `;
            } else {
                topSpendersEl.innerHTML = topSpenders.map((spender, index) => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${index === 0 ? '#f6e05e' : index === 1 ? '#a0aec0' : index === 2 ? '#d69e2e' : '#e2e8f0'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                                ${index + 1}
                            </div>
                            <div class="member-avatar">${spender.name.charAt(0)}</div>
                            <span style="font-weight: 500;">${spender.name}</span>
                        </div>
                        <span style="font-weight: 700; color: #38a169;">¥${spender.total.toLocaleString()}</span>
                    </div>
                `).join('');
            }
        }

        const monthlyChart = document.getElementById('monthly-chart');
        if (monthlyChart) {
            monthlyChart.innerHTML = this.renderMonthlyChart(businessFiltered);
        }

        document.getElementById('transactions-list').innerHTML = this.renderTransactionsList(filtered);
        } catch (e) {
            console.error('updateStatistics error:', e);
        }
    },

    renderTransactionsList(transactions) {
        if (transactions.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>暂无交易记录</p>
                </div>
            `;
        }

        const typeNames = { membership: '会员费', course: '课程费', equipment: '装备租赁', event: '赛事活动', shop: '商店消费', deposit: '押金往来' };
        const typeColors = { membership: 'blue', course: 'purple', equipment: 'green', event: 'orange', shop: 'red', deposit: 'gray' };

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>会员</th>
                            <th>类型</th>
                            <th>描述</th>
                            <th>关联模块</th>
                            <th>金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.slice(-50).reverse().map(t => {
                            const isRefund = t.amount < 0;
                            const isDeposit = t.type === 'deposit';
                            let linkHtml = '';
                            if (t.type === 'course') {
                                linkHtml = `<button class="btn btn-sm btn-primary" style="padding:2px 8px;font-size:0.75rem;" onclick="App.renderPage('courses')">课程</button>`;
                            } else if (t.type === 'event') {
                                linkHtml = `<button class="btn btn-sm btn-success" style="padding:2px 8px;font-size:0.75rem;" onclick="App.renderPage('events')">赛事</button>`;
                            } else if (t.type === 'equipment' || t.type === 'deposit') {
                                linkHtml = `<button class="btn btn-sm btn-warning" style="padding:2px 8px;font-size:0.75rem;" onclick="App.renderPage('equipment')">装备</button>`;
                            } else {
                                linkHtml = `<span style="color:#a0aec0;font-size:0.8rem;">-</span>`;
                            }
                            return `
                            <tr>
                                <td>${t.date}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="member-avatar" style="width: 28px; height: 28px; font-size: 0.75rem;">${t.memberName ? t.memberName.charAt(0) : '-'}</div>
                                        <span>${t.memberName || '-'}</span>
                                    </div>
                                </td>
                                <td><span class="badge badge-${typeColors[t.type] || 'gray'}">${typeNames[t.type] || t.type}</span></td>
                                <td>${t.description}${isDeposit && isRefund ? ' ↩️' : (isDeposit ? ' 💳' : '')}</td>
                                <td>${linkHtml}</td>
                                <td style="color: ${isRefund ? '#e53e3e' : (isDeposit ? '#718096' : '#38a169')}; font-weight: 600;">${isRefund ? '-' : ''}¥${Math.abs(t.amount).toLocaleString()}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    filterTransactions() {
        this.updateStatistics();
    },

    exportData() {
        const data = {
            members: DataStore.getAll('members'),
            transactions: DataStore.getAll('transactions'),
            checkIns: DataStore.getAll('checkIns'),
            courses: DataStore.getAll('courses'),
            courseBookings: DataStore.getAll('courseBookings'),
            events: DataStore.getAll('events'),
            eventRegistrations: DataStore.getAll('eventRegistrations'),
            equipment: DataStore.getAll('equipment'),
            equipmentRentals: DataStore.getAll('equipmentRentals'),
            walls: DataStore.getAll('walls'),
            routes: DataStore.getAll('routes'),
            setters: DataStore.getAll('setters'),
            coaches: DataStore.getAll('coaches'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `climbing-gym-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('数据导出成功！');
    }
};