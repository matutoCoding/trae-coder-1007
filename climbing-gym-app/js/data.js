const DataStore = {
    init() {
        if (!localStorage.getItem('climbing_gym_data')) {
            const initialData = this.getInitialData();
            localStorage.setItem('climbing_gym_data', JSON.stringify(initialData));
        }
    },

    getInitialData() {
        return {
            walls: [
                { id: 1, name: '抱石区A', type: 'bouldering', height: '4.5米', zones: ['暖身区', '进阶区', '高手区'], status: 'active' },
                { id: 2, name: '难度区B', type: 'lead', height: '12米', zones: ['初级区', '中级区', '高级区'], status: 'active' },
                { id: 3, name: '速度区C', type: 'speed', height: '15米', zones: ['标准赛道', '训练赛道'], status: 'active' }
            ],
            routes: [
                { id: 1, wallId: 1, name: '彩虹桥', grade: 'V1', color: '#FF6B6B', setterId: 1, holdCount: 8, createDate: '2026-05-01', nextReplaceDate: '2026-07-01', status: 'active', zone: '暖身区' },
                { id: 2, wallId: 1, name: '峭壁挂松', grade: 'V3', color: '#4ECDC4', setterId: 1, holdCount: 12, createDate: '2026-05-10', nextReplaceDate: '2026-07-10', status: 'active', zone: '进阶区' },
                { id: 3, wallId: 1, name: '龙脊', grade: 'V5', color: '#9B59B6', setterId: 2, holdCount: 15, createDate: '2026-04-20', nextReplaceDate: '2026-06-20', status: 'active', zone: '高手区' },
                { id: 4, wallId: 2, name: '青云直上', grade: '5.10a', color: '#3498DB', setterId: 1, holdCount: 25, createDate: '2026-05-05', nextReplaceDate: '2026-07-05', status: 'active', zone: '中级区' },
                { id: 5, wallId: 2, name: '悬崖漫步', grade: '5.11b', color: '#E74C3C', setterId: 2, holdCount: 30, createDate: '2026-04-25', nextReplaceDate: '2026-06-25', status: 'active', zone: '高级区' },
                { id: 6, wallId: 3, name: '闪电赛道', grade: '5.8', color: '#F1C40F', setterId: 1, holdCount: 20, createDate: '2026-05-15', nextReplaceDate: '2026-07-15', status: 'active', zone: '标准赛道' }
            ],
            setters: [
                { id: 1, name: '张明', level: '国家级定线员', experience: '8年', specialty: '抱石、难度', phone: '13800138001', status: 'active' },
                { id: 2, name: '李华', level: '省级定线员', experience: '5年', specialty: '速度、抱石', phone: '13800138002', status: 'active' },
                { id: 3, name: '王芳', level: '国家级定线员', experience: '10年', specialty: '难度、大岩壁', phone: '13800138003', status: 'active' }
            ],
            members: [
                { id: 1, name: '陈小明', phone: '13900139001', memberType: '年卡', joinDate: '2025-06-01', expireDate: '2026-06-01', totalVisits: 45, status: 'active', photo: null },
                { id: 2, name: '刘小红', phone: '13900139002', memberType: '季卡', joinDate: '2026-03-15', expireDate: '2026-06-15', totalVisits: 28, status: 'active', photo: null },
                { id: 3, name: '王小强', phone: '13900139003', memberType: '次卡(50次)', joinDate: '2026-01-10', expireDate: '2027-01-10', remainingVisits: 32, totalVisits: 18, status: 'active', photo: null },
                { id: 4, name: '赵小丽', phone: '13900139004', memberType: '月卡', joinDate: '2026-05-01', expireDate: '2026-06-01', totalVisits: 12, status: 'expired', photo: null }
            ],
            checkIns: [
                { id: 1, memberId: 1, memberName: '陈小明', date: '2026-06-16', time: '18:30', type: 'entry', wallType: '抱石区', hasSafetyBriefing: true },
                { id: 2, memberId: 2, memberName: '刘小红', date: '2026-06-16', time: '19:00', type: 'entry', wallType: '难度区', hasSafetyBriefing: true },
                { id: 3, memberId: 3, memberName: '王小强', date: '2026-06-15', time: '14:00', type: 'entry', wallType: '抱石区', hasSafetyBriefing: true }
            ],
            coaches: [
                { id: 1, name: '孙教练', level: '高级教练', specialty: '攀岩入门、进阶技巧', experience: '6年', phone: '13700137001', status: 'active', rating: 4.9 },
                { id: 2, name: '周教练', level: '中级教练', specialty: '儿童攀岩、安全防护', experience: '4年', phone: '13700137002', status: 'active', rating: 4.8 },
                { id: 3, name: '吴教练', level: '高级教练', specialty: '竞技攀岩、难度突破', experience: '8年', phone: '13700137003', status: 'active', rating: 4.95 }
            ],
            courses: [
                { id: 1, coachId: 1, coachName: '孙教练', name: '攀岩入门私教', type: 'private', level: ' beginner', duration: '90分钟', price: 300, schedule: '周一至周五 10:00-20:00', maxStudents: 1, description: '针对零基础学员，教授攀岩基础动作和安全知识', status: 'available' },
                { id: 2, coachId: 2, coachName: '周教练', name: '儿童攀岩班', type: 'group', level: ' beginner', duration: '60分钟', price: 200, schedule: '周六周日 09:00-11:00', maxStudents: 6, description: '专为6-12岁儿童设计的攀岩启蒙课程', status: 'available' },
                { id: 3, coachId: 3, coachName: '吴教练', name: '竞技攀岩提升班', type: 'private', level: 'advanced', duration: '120分钟', price: 500, schedule: '周二周四 18:00-21:00', maxStudents: 1, description: '针对有基础的攀岩者，提升竞技水平', status: 'available' }
            ],
            courseBookings: [
                { id: 1, courseId: 1, courseName: '攀岩入门私教', memberId: 1, memberName: '陈小明', date: '2026-06-18', time: '18:00', status: 'confirmed', paymentStatus: 'paid' },
                { id: 2, courseId: 2, courseName: '儿童攀岩班', memberId: 2, memberName: '刘小红', date: '2026-06-20', time: '09:00', status: 'pending', paymentStatus: 'unpaid' }
            ],
            equipment: [
                { id: 1, name: '安全带', type: 'harness', brand: 'Petzl', size: 'M', price: 50, deposit: 200, total: 20, available: 15, status: 'available' },
                { id: 2, name: '安全带', type: 'harness', brand: 'Petzl', size: 'L', price: 50, deposit: 200, total: 15, available: 10, status: 'available' },
                { id: 3, name: '攀岩鞋', type: 'shoes', brand: 'La Sportiva', size: '40', price: 40, deposit: 300, total: 10, available: 6, status: 'available' },
                { id: 4, name: '攀岩鞋', type: 'shoes', brand: 'La Sportiva', size: '42', price: 40, deposit: 300, total: 12, available: 8, status: 'available' },
                { id: 5, name: '镁粉袋', type: 'chalk_bag', brand: 'Black Diamond', size: '均码', price: 20, deposit: 50, total: 30, available: 25, status: 'available' },
                { id: 6, name: '头盔', type: 'helmet', brand: 'Petzl', size: '均码', price: 30, deposit: 300, total: 15, available: 12, status: 'available' }
            ],
            equipmentRentals: [
                { id: 1, memberId: 1, memberName: '陈小明', equipmentId: 1, equipmentName: '安全带(M)', rentDate: '2026-06-16', rentTime: '18:30', returnDate: null, returnTime: null, deposit: 200, rentFee: 50, status: 'rented' },
                { id: 2, memberId: 2, memberName: '刘小红', equipmentId: 3, equipmentName: '攀岩鞋(40)', rentDate: '2026-06-16', rentTime: '19:00', returnDate: '2026-06-16', returnTime: '21:00', deposit: 300, rentFee: 40, status: 'returned' }
            ],
            events: [
                { id: 1, name: '2026年攀岩等级考试(初级)', type: 'grading', level: '初级', date: '2026-06-25', time: '09:00', location: '难度区B', maxParticipants: 30, registered: 15, price: 200, description: '中国登山协会初级攀岩等级考试', status: 'open' },
                { id: 2, name: '岩馆月度抱石赛', type: 'competition', level: '公开组', date: '2026-07-05', time: '14:00', location: '抱石区A', maxParticipants: 50, registered: 28, price: 100, description: '月度抱石交流赛，分男子组、女子组', status: 'open' },
                { id: 3, name: '攀岩安全培训讲座', type: 'training', level: '通用', date: '2026-06-20', time: '19:00', location: '多功能厅', maxParticipants: 40, registered: 20, price: 0, description: '免费安全培训，内容包括保护技术、应急处理', status: 'open' }
            ],
            eventRegistrations: [
                { id: 1, eventId: 1, eventName: '2026年攀岩等级考试(初级)', memberId: 1, memberName: '陈小明', date: '2026-06-10', status: 'confirmed', paymentStatus: 'paid' },
                { id: 2, eventId: 2, eventName: '岩馆月度抱石赛', memberId: 3, memberName: '王小强', date: '2026-06-12', status: 'confirmed', paymentStatus: 'paid' }
            ],
            transactions: [
                { id: 1, memberId: 1, memberName: '陈小明', type: 'membership', amount: 2888, date: '2025-06-01', description: '年卡会员费' },
                { id: 2, memberId: 2, memberName: '刘小红', type: 'membership', amount: 688, date: '2026-03-15', description: '季卡会员费' },
                { id: 3, memberId: 1, memberName: '陈小明', type: 'course', amount: 300, date: '2026-06-18', description: '私教课程费' },
                { id: 4, memberId: 1, memberName: '陈小明', type: 'equipment', amount: 50, date: '2026-06-16', description: '安全带租赁' },
                { id: 5, memberId: 2, memberName: '刘小红', type: 'equipment', amount: 40, date: '2026-06-16', description: '攀岩鞋租赁' },
                { id: 6, memberId: 1, memberName: '陈小明', type: 'event', amount: 200, date: '2026-06-10', description: '攀岩等级考试报名费' },
                { id: 7, memberId: 3, memberName: '王小强', type: 'event', amount: 100, date: '2026-06-12', description: '抱石赛报名费' },
                { id: 8, memberId: 3, memberName: '王小强', type: 'membership', amount: 1588, date: '2026-01-10', description: '50次次卡' },
                { id: 9, memberId: 2, memberName: '刘小红', type: 'course', amount: 200, date: '2026-06-20', description: '儿童攀岩班' },
                { id: 10, memberId: 1, memberName: '陈小明', type: 'shop', amount: 128, date: '2026-06-01', description: '购买镁粉' }
            ]
        };
    },

    getAll(key) {
        const data = JSON.parse(localStorage.getItem('climbing_gym_data'));
        return data[key] || [];
    },

    getById(key, id) {
        const items = this.getAll(key);
        return items.find(item => item.id === id);
    },

    add(key, item) {
        const data = JSON.parse(localStorage.getItem('climbing_gym_data'));
        const items = data[key] || [];
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        item.id = newId;
        items.push(item);
        data[key] = items;
        localStorage.setItem('climbing_gym_data', JSON.stringify(data));
        return item;
    },

    update(key, id, updates) {
        const data = JSON.parse(localStorage.getItem('climbing_gym_data'));
        const items = data[key] || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            data[key] = items;
            localStorage.setItem('climbing_gym_data', JSON.stringify(data));
            return items[index];
        }
        return null;
    },

    delete(key, id) {
        const data = JSON.parse(localStorage.getItem('climbing_gym_data'));
        const items = data[key] || [];
        data[key] = items.filter(item => item.id !== id);
        localStorage.setItem('climbing_gym_data', JSON.stringify(data));
    },

    query(key, filterFn) {
        const items = this.getAll(key);
        return items.filter(filterFn);
    }
};

DataStore.init();
