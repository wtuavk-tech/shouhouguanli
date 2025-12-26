import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { 
  Copy, 
  FileText, 
  CheckCircle, 
  Info, 
  Search, 
  AlertTriangle, 
  Trash2, 
  DollarSign, 
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Calendar,
  MessageCircle,
  Send,
  Smile,
  Video,
  Paperclip,
  User,
  ListFilter,
  SlidersHorizontal,
  Activity,
  Zap,
  LayoutDashboard,
  Wallet,
  ClipboardList,
  Megaphone,
  Bell,
  Check,
  Users,
  Settings,
  MapPin,
  Clock,
  Tag,
  Eye,
  Phone,
  Image,
  PauseCircle,
  Archive,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Headset
} from 'lucide-react';

// --- 类型定义 ---

enum OrderStatus {
  PendingDispatch = '待处理',
  Completed = '已完成',
  Void = '作废',
  Returned = '已退回',
  Error = '报错'
}

interface Order {
  id: number;
  remainingTime: number;         // 剩余时间（小时）
  isMallOrder: boolean;          // 商城订单
  orderNo: string;               // 订单号 (工单号)
  originalOrderNo: string;       // 原始订单号 (New)
  mobile: string;                // 手机号
  initiator: string;             // 发起人
  createTime: string;            // 创建时间
  orderTime: string;             // 订单时间 (New)
  customerName: string;          // 客户名称
  source: string;                // 订单来源
  status: OrderStatus;           // 状态
  cashierPaymentAmount: number;  // 出纳付款金额
  customerRequest: string;       // 客户诉求
  remark: string;                // 备注
  recorderName: string;          // 录单人
  masterName: string;            // 师傅
  revenue: number;               // 业绩
  responsibleParty: string;      // 责任方
  totalRefund: number;           // 总退款
  refundMethod: string;          // 退款方式
  masterRefund: number;          // 师傅退款
  entryStatus: string;           // 入账状态
  companyRefund: number;         // 公司退款
  masterCost: number;            // 师傅成本
  customerPaymentCode: boolean;  // 顾客收款码 (模拟是否存在)
  invalidVoucher: boolean;       // 不可凭证 -> 改为 补款凭证
  paymentVoucher: boolean;       // 付款凭证 (模拟是否存在)
  completerName: string;         // 办结人
  completionType: string;        // 办结类型
  completionTime: string;        // 办结时间
  completionNote: string;        // 完结说明
  voiderName: string;            // 作废人
  voidReason: string;            // 作废原因
  masterRefundTime: string;      // 师傅退款时间
  companyRefundTime: string;     // 公司退款时间
  masterCostTime: string;        // 师傅成本时间
  platformRefund: number;        // 平台退款
  overtimeAlert: number;         // 超时提醒（小时）
  isSuspended: boolean;          // 是否挂起 (New)
  
  totalAmount: number;           
  details: string;
  region: string;
  address: string;
  serviceItem: string;
}

// --- 辅助函数 ---
const formatCurrency = (amount: number) => {
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(1);
};

const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// --- Mock 数据生成 ---
const generateMockData = (): Order[] => {
  const sources = ['小程序', '电话', '美团', '转介绍', '抖音', '58同城'];
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'];
  const masters = ['王师傅', '李师傅', '张师傅', '刘师傅', '陈师傅'];
  const dispatchers = ['客服A', '客服B', '客服C', '系统自动'];
  const initiators = ['用户自发', '系统生成', '客服代客'];
  const refundMethods = ['原路退回', '微信转账', '支付宝', '线下现金'];
  const entryStatuses = ['已入账', '未入账', '挂账', '异常'];
  const completionTypes = ['正常完结', '强制完结', '异常完结'];
  
  let pendingCount = 0;

  return Array.from({ length: 128 }).map((_, i) => {
    const id = i + 1;
    let status = OrderStatus.Completed;

    if (pendingCount < 10 && i % 10 === 0) { 
      status = OrderStatus.PendingDispatch;
      pendingCount++;
    } else if (i % 15 === 1) {
      status = OrderStatus.Void;
    } else if (i % 15 === 2) {
      status = OrderStatus.Returned;
    } else if (i % 15 === 3) {
      status = OrderStatus.Error;
    } else {
      status = OrderStatus.Completed;
    }

    const amount = 150 + (i % 20) * 20;
    const now = new Date();
    const createDate = new Date(now.getTime() - Math.random() * 86400000 * 5);
    const orderDate = new Date(createDate.getTime() - Math.random() * 3600000 * 4);
    const completeDate = new Date(createDate.getTime() + Math.random() * 86400000);
    const refundDate = new Date(completeDate.getTime() + Math.random() * 86400000);

    return {
      id,
      remainingTime: Math.floor(Math.random() * 48),
      isMallOrder: Math.random() > 0.8,
      orderNo: `ORD-${20230000 + i}`,
      originalOrderNo: `ORI-${String(90000000 + i)}`,
      mobile: `13${i % 9 + 1}****${String(1000 + i).slice(-4)}`,
      initiator: initiators[i % initiators.length],
      createTime: formatDate(createDate),
      orderTime: formatDate(orderDate),
      customerName: names[i % names.length],
      source: sources[i % sources.length],
      status,
      cashierPaymentAmount: Math.random() > 0.5 ? amount : 0,
      customerRequest: i % 5 === 0 ? '加急处理' : '无特殊要求。此单需要特别注意客户的时间安排，请务必提前联系确认。',
      remark: i % 8 === 0 ? '客户要求下午上门' : '',
      recorderName: dispatchers[i % dispatchers.length],
      masterName: masters[i % masters.length],
      revenue: amount * 0.3,
      responsibleParty: i % 10 === 0 ? '师傅' : '公司',
      totalRefund: i % 20 === 0 ? 50 : 0,
      refundMethod: i % 20 === 0 ? refundMethods[i % refundMethods.length] : '-',
      masterRefund: i % 30 === 0 ? 20 : 0,
      entryStatus: entryStatuses[i % entryStatuses.length],
      companyRefund: i % 40 === 0 ? 30 : 0,
      masterCost: amount * 0.6,
      customerPaymentCode: Math.random() > 0.5,
      invalidVoucher: Math.random() > 0.9,
      paymentVoucher: Math.random() > 0.5,
      completerName: dispatchers[(i + 2) % dispatchers.length],
      completionType: completionTypes[i % completionTypes.length],
      completionTime: status === OrderStatus.Completed ? formatDate(completeDate) : '-',
      completionNote: status === OrderStatus.Completed ? '服务完成，客户满意' : '',
      voiderName: status === OrderStatus.Void ? '管理员' : '-',
      voidReason: status === OrderStatus.Void ? '客户取消' : '-',
      masterRefundTime: i % 30 === 0 ? formatDate(refundDate) : '-',
      companyRefundTime: i % 40 === 0 ? formatDate(refundDate) : '-',
      masterCostTime: formatDate(completeDate),
      platformRefund: i % 50 === 0 ? 10 : 0,
      overtimeAlert: parseFloat((Math.random() * 24).toFixed(1)),
      isSuspended: Math.random() < 0.05,
      
      totalAmount: amount,
      details: '无',
      region: '默认区域',
      address: '默认地址',
      serviceItem: '默认服务'
    };
  });
};

const FULL_MOCK_DATA = generateMockData();

// --- 组件定义 ---

const NotificationBar = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "关于 2025 年度秋季职级晋升评审的通知：点击下方详情以阅读完整公告内容。请所有相关人员务必在截止日期前完成确认。",
    "系统升级通知：今晚 24:00 将进行系统维护，预计耗时 30 分钟。",
    "10月业绩pk赛圆满结束，恭喜华东大区获得冠军！"
  ];
  const icons = [Megaphone, AlertTriangle, Activity];
  const CurrentIcon = icons[msgIndex];

  useEffect(() => {
    // Scroll every 1 hour (3600000ms)
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-3 bg-white rounded-lg border border-[#cbd5e1] px-4 py-3 flex items-center gap-4 shadow-sm">
      {/* Label */}
      <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded text-[13px] font-bold font-sans whitespace-nowrap z-10 shrink-0 shadow-sm">
        <span className="tracking-wide">主要公告</span>
        <Bell size={14} fill="currentColor" />
      </div>
      
      {/* Static Text (Changes hourly) */}
      <div className="flex-1 overflow-hidden flex items-center text-sm text-slate-700 font-medium font-sans">
          <CurrentIcon size={16} className={`mr-2 ${msgIndex === 1 ? 'text-orange-500' : (msgIndex === 2 ? 'text-red-500' : 'text-blue-500')}`} />
          <span className="truncate">{messages[msgIndex]}</span>
      </div>

      {/* Date Badge */}
      <div className="shrink-0 z-10 pl-4 border-l border-[#cbd5e1]">
          <div className="text-slate-500 text-xs font-sans">
            2025-11-19
          </div>
      </div>
    </div>
  );
};

const SearchPanel = ({ suspendedCount }: { suspendedCount: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const pendingCount = FULL_MOCK_DATA.filter(o => o.status === OrderStatus.PendingDispatch).length;
  const processedCount = FULL_MOCK_DATA.filter(o => o.status === OrderStatus.Completed).length;
  
  const pending24h = Math.floor(pendingCount * 0.75); 
  const pending48h = Math.floor(pendingCount * 0.45); 
  const pending72h = Math.floor(pendingCount * 0.2); 
  const overtimeCount = FULL_MOCK_DATA.filter(o => o.overtimeAlert > 0 && ![OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(o.status)).length;

  const stats = {
    todayNew: 15,
    pending: pendingCount,
    processed: processedCount,
    refundTodayCount: 3,
    refundTodayAmount: 450.5,
    lastWeekRate: '98.5%',
    processed24h: 42,
    pending24h,
    pending48h,
    pending72h,
    overtimeCount
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* 1. Data Overview Bar - White background, specific colors from image */}
      <div className="bg-white border border-[#cbd5e1] rounded-lg px-6 py-4 flex items-center shadow-sm overflow-hidden">
         <div className="flex items-center flex-1 overflow-hidden">
            {/* Title: Sans-serif, Clean */}
            <div className="flex items-center gap-2 border-r border-[#cbd5e1] pr-6 shrink-0 select-none">
               <div className="bg-blue-600 p-1.5 rounded-md">
                  <BarChart3 size={18} className="text-white" />
               </div>
               <span className="text-[16px] text-slate-800 font-bold font-sans whitespace-nowrap">数据概览</span>
            </div>
            
            {/* Metrics: Clean layout matching image vibe */}
            <div className="flex items-center justify-between flex-1 px-8 min-w-0">
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">今日新增</span>
                  <span className="font-bold text-slate-900 text-[18px] font-sans">{stats.todayNew}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">待处理</span>
                  <span className="font-bold text-orange-500 text-[18px] font-sans">{stats.pending}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">超时</span>
                  <span className="font-bold text-red-500 text-[18px] animate-pulse font-sans">{stats.overtimeCount}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">今日业绩</span>
                  <span className="font-bold text-emerald-500 text-[18px] font-sans">¥{12850.0.toFixed(1)}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">收款率</span>
                  <span className="font-bold text-slate-700 text-[18px] font-sans">{stats.lastWeekRate}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-[13px] font-sans whitespace-nowrap">今日退款</span>
                  <span className="font-bold text-red-500 text-[18px] font-sans">¥{stats.refundTodayAmount}</span>
               </div>
            </div>
         </div>

         {/* Toggle Button - Rounded Circle style similar to image search icon area */}
         <div className="border-l border-[#cbd5e1] pl-6 ml-2">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-blue-600 transition-colors group"
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isExpanded ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-[#cbd5e1] group-hover:border-blue-300'}`}>
                    <Search size={16} />
                </div>
                <span className="text-[10px]">高级筛选</span>
            </button>
         </div>
      </div>

      {/* 2. Expanded Filter Section */}
      {isExpanded && (
        <div className="bg-white border border-[#cbd5e1] rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium font-sans">订单号/手机号</label>
                  <input type="text" placeholder="请输入" className="h-8 px-3 border border-[#cbd5e1] rounded text-sm focus:border-blue-500 focus:outline-none font-sans" />
              </div>
              <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium font-sans">师傅</label>
                  <input type="text" placeholder="请输入" className="h-8 px-3 border border-[#cbd5e1] rounded text-sm focus:border-blue-500 focus:outline-none font-sans" />
              </div>
              <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium font-sans">订单来源</label>
                  <select className="h-8 px-3 border border-[#cbd5e1] rounded text-sm focus:border-blue-500 focus:outline-none text-slate-600 font-sans">
                    <option>请选择</option>
                  </select>
              </div>
              <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium font-sans">状态</label>
                  <select className="h-8 px-3 border border-[#cbd5e1] rounded text-sm focus:border-blue-500 focus:outline-none text-slate-600 font-sans">
                    <option>请选择</option>
                  </select>
              </div>
              <div className="flex items-end gap-2 col-span-2 lg:col-span-2">
                  <button className="h-8 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors shadow-sm font-medium flex items-center justify-center gap-1 font-sans">
                      <Search size={14} /> 搜索
                  </button>
                  <button className="h-8 px-6 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 text-sm rounded transition-colors border border-[#cbd5e1] shadow-sm font-medium flex items-center justify-center font-sans">
                      重置
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modals & Cells ---

const TooltipCell = ({ content }: { content: string }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ x: rect.left + rect.width / 2, y: rect.top });
      setShow(true);
    }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="max-w-[120px] truncate cursor-help text-slate-700 hover:text-blue-600 transition-colors font-sans" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={() => setShow(false)}
      >
        {content}
      </div>
      {show && createPortal(
        <div 
            className="fixed z-[9999] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl max-w-xs break-words pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 font-sans"
            style={{ top: coords.y - 8, left: coords.x, transform: 'translate(-50%, -100%)' }}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>,
        document.body
      )}
    </>
  );
};

const StatusCell = ({ order }: { order: Order }) => {
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingDispatch: return 'bg-orange-50 text-orange-500 border border-orange-100'; // Updated to match image
      case OrderStatus.Returned: return 'bg-red-50 text-red-500 border border-red-100';
      case OrderStatus.Error: return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case OrderStatus.Void: return 'bg-gray-50 text-gray-400 border border-gray-200';
      case OrderStatus.Completed: return 'bg-green-50 text-green-600 border border-green-100';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className={`px-2.5 py-0.5 rounded text-[12px] font-medium font-sans whitespace-nowrap ${getStatusStyle(order.status)}`}>
        {order.status}
      </span>
    </div>
  );
};

const CompleteOrderModal = ({ isOpen, onClose, order }: { isOpen: boolean; onClose: () => void; order: Order | null }) => {
  if (!isOpen || !order) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white"><h3 className="text-xl font-bold font-sans">完成订单</h3></div>
          <div className="p-6 space-y-4">
             <div className="flex justify-between text-sm"><span className="text-slate-500 font-sans">应收金额</span><span className="font-bold text-lg text-emerald-600 font-sans">¥{order.totalAmount}</span></div>
             <input type="number" defaultValue={order.totalAmount} className="w-full border border-[#cbd5e1] rounded-lg p-2 font-sans" />
          </div>
          <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-slate-600 font-sans">取消</button>
             <button onClick={onClose} className="px-6 py-2 bg-green-600 text-white rounded-lg font-sans">确认完成</button>
          </div>
       </div>
    </div>,
    document.body
  );
};

const ActionCell = ({ order, onAction }: { order: Order; onAction: (action: string, id: number) => void }) => {
  return (
    <div className="flex items-center justify-center gap-1 font-sans">
        <button onClick={() => onAction('修改', order.id)} className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap">修改</button>
        <button onClick={() => onAction('完结', order.id)} className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap">完结</button>
        <button onClick={() => onAction('复制', order.id)} className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap">复制</button>
        <button onClick={() => onAction('作废', order.id)} className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap">作废</button>
        <button onClick={() => onAction('挂起', order.id)} className={`text-xs whitespace-nowrap ${order.isSuspended ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-orange-500'}`}>{order.isSuspended ? '已挂起' : '挂起'}</button>
    </div>
  );
};

const App = () => {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showSuspendedOnly, setShowSuspendedOnly] = useState(false);
  const [orders, setOrders] = useState<Order[]>(FULL_MOCK_DATA);
  const suspendedCount = orders.filter(o => o.isSuspended).length;

  const sortedData = [...orders].sort((a, b) => {
    const isInactive = (status: OrderStatus) => [OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(status);
    const aInactive = isInactive(a.status);
    const bInactive = isInactive(b.status);
    const aOvertime = aInactive ? -9999 : a.overtimeAlert;
    const bOvertime = bInactive ? -9999 : b.overtimeAlert;
    if (aOvertime !== bOvertime) return bOvertime - aOvertime;
    const isAPending = a.status === OrderStatus.PendingDispatch;
    const isBPending = b.status === OrderStatus.PendingDispatch;
    if (isAPending && !isBPending) return -1;
    if (!isAPending && isBPending) return 1;
    return a.remainingTime - b.remainingTime;
  });

  const displayData = showSuspendedOnly ? sortedData.filter(o => o.isSuspended) : sortedData;
  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentData = displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAction = (action: string, id: number) => {
    if (action === '挂起') {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, isSuspended: !o.isSuspended } : o));
      return;
    }
    const order = sortedData.find(o => o.id === id);
    if (!order) return;
    if (action === '完单') { setCurrentOrder(order); setCompleteModalOpen(true); } 
    else { alert(`已执行操作：${action} (订单ID: ${id})`); }
  };

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
  const handlePageChange = (p: number) => { if(p >= 1 && p <= totalPages) setCurrentPage(p); }

  useEffect(() => { setCurrentPage(1); }, [showSuspendedOnly]);

  const ImageState = ({ hasImage }: { hasImage: boolean }) => (
    hasImage ? <div className="flex justify-center"><ImageIcon size={14} className="text-blue-500"/></div> : <div className="flex justify-center text-gray-300">-</div>
  );

  const renderPagination = () => {
    const range = [];
    if (totalPages <= 7) {
        for(let i=1; i<=totalPages; i++) range.push(i);
    } else {
        range.push(1);
        if (currentPage > 4) range.push('...');
        let start = Math.max(2, currentPage - 2);
        let end = Math.min(totalPages - 1, currentPage + 2);
        if (currentPage <= 4) { end = 6; start = 2; } 
        else if (currentPage >= totalPages - 3) { start = totalPages - 5; end = totalPages - 1; }
        for (let i = start; i <= end; i++) range.push(i);
        if (currentPage < totalPages - 3) range.push('...');
        range.push(totalPages);
    }
    return range;
  };
  
  const paginationRange = renderPagination();

  return (
    <div className="h-screen bg-[#F3F4F6] p-4 flex flex-col overflow-hidden relative font-sans text-slate-900">
      <style>{`
        td, th { z-index: 1; position: relative; }
        .sticky-col { position: sticky !important; z-index: 100 !important; background-clip: padding-box; }
        thead th.sticky-col { z-index: 110 !important; }
        thead th:not(.sticky-col) { z-index: 50; }
        th.sticky-th-solid { background-color: #F9FAFB !important; }
        tr td.sticky-bg-solid { background-color: #ffffff !important; }
        tr:hover td.sticky-bg-solid { background-color: #eff6ff !important; }
        .sticky-right-action { right: 0px !important; width: 170px; }
        .sticky-right-alert { right: 170px !important; width: 100px; border-left: none !important; box-shadow: none !important; background-color: #38bdf8 !important; }
        .sticky-right-contact { right: 270px !important; width: 160px !important; min-width: 160px !important; border-left: 1px solid #cbd5e1 !important; box-shadow: -6px 0 10px -4px rgba(0,0,0,0.05); }
        tr td.sticky-right-alert, tr:nth-child(even) td.sticky-right-alert, tr:hover td.sticky-right-alert { background-color: #38bdf8 !important; }
      `}</style>
      <div className="w-full flex-1 flex flex-col h-full">
        
        <NotificationBar />
        <SearchPanel suspendedCount={suspendedCount} />
        
        <div className="bg-white rounded-lg shadow-sm border border-[#cbd5e1] flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="overflow-x-auto flex-1 overflow-y-auto relative">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-40 shadow-sm">
                <tr className="bg-[#F9FAFB] border-b border-[#cbd5e1] text-xs font-bold font-sans text-slate-700 tracking-wider">
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">商城订单</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30 min-w-[180px]">工单号/订单号</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">手机号</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">服务项目</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">发起人</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30 min-w-[120px]">订单/创建时间</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">客户名称</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">订单来源</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">状态</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">出纳付款金额</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30 max-w-[120px]">客户诉求</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30 max-w-[120px]">备注</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">录单人</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">师傅</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">业绩</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">责任方</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">总退款</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">退款方式</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">师傅退款</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">入账状态</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">公司退款</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">师傅成本</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">顾客收款码</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">补款凭证</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] text-center sticky top-0 z-30">付款凭证</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">办结人</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">办结类型</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">办结时间</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30 max-w-[150px]">完结说明</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">作废人</th>
                  <th className="px-3 py-3 whitespace-nowrap bg-[#F9FAFB] sticky top-0 z-30">作废原因</th>
                  <th className="px-2 py-3 whitespace-nowrap bg-[#F9FAFB] sticky-th-solid sticky-col sticky-right-contact w-[160px] text-center border-l border-[#cbd5e1]">联系人</th>
                  <th className="px-3 py-3 whitespace-nowrap text-center w-[100px] sticky-th-solid sticky-col sticky-right-alert">剩余/超时(H)</th>
                  <th className="px-3 py-3 whitespace-nowrap text-center w-[170px] sticky-th-solid sticky-col sticky-right-action border-l border-[#cbd5e1]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]">
                {currentData.map((order) => (
                  <tr key={order.id} className="bg-white hover:bg-blue-50/60 transition-colors group text-xs border-b border-[#cbd5e1] last:border-0 align-middle">
                    <td className="px-3 py-2 text-center text-slate-700 font-sans">{order.isMallOrder ? '是' : '否'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 font-sans text-xs select-all">{order.orderNo}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-sans text-[11px] select-all">{order.originalOrderNo}</span>
                          <span className="text-[11px] text-blue-500 hover:text-blue-700 cursor-pointer underline hover:no-underline whitespace-nowrap font-sans">跳转原始单详情</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-900 font-bold font-sans">{order.mobile}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-sans">{order.serviceItem}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-sans">{order.initiator}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-slate-900 font-medium font-sans">{order.orderTime}</span>
                            <span className="text-slate-500 text-[11px] mt-0.5 font-sans">{order.createTime}</span>
                        </div>
                    </td>
                    <td className="px-3 py-2 text-slate-900 font-medium font-sans">{order.customerName}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap font-sans"><span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded border border-[#cbd5e1]">{order.source}</span></td>
                    <td className="px-3 py-2 text-center"><StatusCell order={order} /></td>
                    <td className="px-3 py-2 text-center font-bold font-sans text-slate-900">{formatCurrency(order.cashierPaymentAmount)}</td>
                    <td className="px-3 py-2 text-slate-700 max-w-[120px] font-sans"><TooltipCell content={order.customerRequest} /></td>
                    <td className="px-3 py-2 text-slate-700 max-w-[120px] truncate font-sans" title={order.remark}>{order.remark || '-'}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-sans">{order.recorderName}</td>
                    <td className="px-3 py-2 text-slate-900 font-medium whitespace-nowrap font-sans">{order.masterName}</td>
                    <td className="px-3 py-2 text-center font-bold font-sans text-orange-600">{formatCurrency(order.revenue)}</td>
                    <td className="px-3 py-2 text-slate-700 font-sans">{order.responsibleParty}</td>
                    <td className="px-3 py-2 text-center font-bold font-sans text-slate-700">{formatCurrency(order.totalRefund)}</td>
                    <td className="px-3 py-2 text-center text-slate-600 font-sans">{order.refundMethod}</td>
                    <td className="px-3 py-2 text-center font-sans font-medium text-slate-700">{formatCurrency(order.masterRefund)}</td>
                    <td className="px-3 py-2 text-center text-slate-700 font-sans">{order.entryStatus}</td>
                    <td className="px-3 py-2 text-center font-sans font-medium text-slate-700">{formatCurrency(order.companyRefund)}</td>
                    <td className="px-3 py-2 text-center font-sans font-medium text-slate-600">{formatCurrency(order.masterCost)}</td>
                    <td className="px-3 py-2"><ImageState hasImage={order.customerPaymentCode} /></td>
                    <td className="px-3 py-2"><ImageState hasImage={order.invalidVoucher} /></td>
                    <td className="px-3 py-2"><ImageState hasImage={order.paymentVoucher} /></td>
                    <td className="px-3 py-2 text-slate-700 font-sans">{order.completerName}</td>
                    <td className="px-3 py-2 text-slate-700 font-sans">{order.completionType}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap font-sans">{order.completionTime}</td>
                    <td className="px-3 py-2 text-slate-500 max-w-[150px] truncate font-sans" title={order.completionNote}>{order.completionNote || '-'}</td>
                    <td className="px-3 py-2 text-slate-500 font-sans">{order.voiderName}</td>
                    <td className="px-3 py-2 text-slate-500 font-sans">{order.voidReason}</td>
                    <td className="px-2 py-2 sticky-col sticky-right-contact sticky-bg-solid border-l border-[#cbd5e1]">
                      <div className="grid grid-cols-2 gap-1.5 justify-items-center w-fit mx-auto">
                        <button className="w-[22px] h-[22px] rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all shadow-sm" title="客服">
                          <Headset size={12} />
                        </button>
                        <button className="w-[22px] h-[22px] rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 hover:scale-105 transition-all shadow-sm" title="派单员">
                          <User size={12} />
                        </button>
                        <button className="w-[22px] h-[22px] rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-sm" title="运营">
                          <MessageCircle size={12} />
                        </button>
                        <button className="w-[22px] h-[22px] rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 hover:scale-105 transition-all shadow-sm" title="群聊">
                          <Phone size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center sticky-col sticky-right-alert align-middle">
                      {[OrderStatus.Completed, OrderStatus.Void, OrderStatus.Returned].includes(order.status) ? (
                        <span className="text-white/70 font-medium font-sans">/</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 h-8">
                            <span className="text-base font-sans font-bold text-white">{order.remainingTime}</span>
                            {order.overtimeAlert > 0 && <span className="ml-1 px-1 border border-yellow-300 rounded text-[13px] font-extrabold text-yellow-300 animate-pulse font-sans">+{order.overtimeAlert}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center sticky-col sticky-right-action sticky-bg-solid border-l border-[#cbd5e1]">
                      <ActionCell order={order} onAction={handleAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-4 py-3 border-t border-[#cbd5e1] flex justify-center items-center mt-auto">
             <div className="flex items-center gap-3 select-none text-sm">
                <span className="text-slate-500 font-sans">共 <span className="font-bold">{totalItems}</span> 条</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="border border-[#cbd5e1] rounded px-2 py-1 text-slate-700 outline-none focus:border-blue-500 cursor-pointer hover:border-blue-400 font-sans">
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                    <option value={100}>100条/页</option>
                </select>
                <div className="flex items-center gap-1">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center border border-[#cbd5e1] rounded bg-white text-slate-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                    {paginationRange.map((page, idx) => (
                        page === '...' ? <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold font-sans">···</span> : 
                        <button key={page} onClick={() => handlePageChange(page as number)} className={`w-8 h-8 flex items-center justify-center border rounded font-medium transition-colors font-sans ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-[#cbd5e1] bg-white text-slate-600 hover:border-blue-500 hover:text-blue-500'}`}>{page}</button>
                    ))}
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center border border-[#cbd5e1] rounded bg-white text-slate-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                </div>
                <div className="flex items-center gap-2 text-slate-500 ml-2 font-sans">
                    <span>前往</span>
                    <input type="number" min={1} max={totalPages} defaultValue={currentPage} onKeyDown={(e) => { if (e.key === 'Enter') { const val = parseInt(e.currentTarget.value); if (val >= 1 && val <= totalPages) setCurrentPage(val); } }} onBlur={(e) => { const val = parseInt(e.target.value); if (val >= 1 && val <= totalPages) setCurrentPage(val); else e.target.value = currentPage.toString(); }} className="w-12 h-8 border border-[#cbd5e1] rounded text-center outline-none focus:border-blue-500 text-slate-700 font-sans" />
                    <span>页</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => setShowSuspendedOnly(!showSuspendedOnly)} className={`fixed bottom-6 right-6 w-20 h-20 rounded-full shadow-xl flex flex-col items-center justify-center text-white transition-all z-[9999] active:scale-95 ${showSuspendedOnly ? 'bg-orange-600 ring-4 ring-orange-200 scale-110' : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'}`} title={showSuspendedOnly ? "显示全部订单" : "只显示挂起订单"}><span className="text-[10px] font-medium opacity-90 mb-0.5 whitespace-nowrap font-sans">已挂起数</span><span className="text-2xl font-bold leading-none font-sans">{suspendedCount}</span></button>
      <CompleteOrderModal isOpen={completeModalOpen} onClose={() => setCompleteModalOpen(false)} order={currentOrder} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const appRoot = createRoot(container);
  appRoot.render(<App />);
}