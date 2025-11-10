'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';

// Mock data
const revenueByMonth = [
	{ month: 'Янв', revenue: 145000 },
	{ month: 'Фев', revenue: 152000 },
	{ month: 'Мар', revenue: 168000 },
	{ month: 'Апр', revenue: 174000 },
	{ month: 'Май', revenue: 189000 },
	{ month: 'Июн', revenue: 195000 },
	{ month: 'Июл', revenue: 203000 },
	{ month: 'Авг', revenue: 198000 },
	{ month: 'Сен', revenue: 185000 },
	{ month: 'Окт', revenue: 192000 },
	{ month: 'Ноя', revenue: 201000 },
	{ month: 'Дек', revenue: 215000 },
];

const courtUtilization = [
	{ court: 'Корт №1', utilization: 85 },
	{ court: 'Корт №2', utilization: 72 },
	{ court: 'Корт №3', utilization: 68 },
	{ court: 'Корт №4', utilization: 91 },
	{ court: 'Корт №5', utilization: 77 },
];

export default function AnalyticsPage() {
	const [period, setPeriod] = useState('custom');
	const [selectedCourt, setSelectedCourt] = useState('all');
	const [chartView, setChartView] = useState('month');

	return (
		<AdminLayout>
			<div className="space-y-6">
				{/* Header */}
				<div>
					<p className="text-xl font-bold text-primary mt-1">
						Статистика и показатели эффективности
					</p>
				</div>

				{/* Filters */}
				<Card className="p-4 w-fit items-end">
					<div className="flex gap-2">
						<div>
							<Label className="text-sm font-medium text-foreground mb-2 block">
								От
							</Label>
							<Input type="date" />
						</div>

						<div>
							<Label className="text-sm font-medium text-foreground mb-2 block">
								До
							</Label>
							<Input type="date" />
						</div>

						<div>
							<Label className="text-sm font-medium text-foreground mb-2 block">
								Корт
							</Label>
							<Select
								value={selectedCourt}
								onValueChange={setSelectedCourt}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										Все корты
									</SelectItem>
									<SelectItem value="court1">
										Корт №1
									</SelectItem>
									<SelectItem value="court2">
										Корт №2
									</SelectItem>
									<SelectItem value="court3">
										Корт №3
									</SelectItem>
									<SelectItem value="court4">
										Корт №4
									</SelectItem>
									<SelectItem value="court5">
										Корт №5
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				{/* Metric Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Revenue Card */}
					<Card className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Доход за период
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									215 000 ₽
								</p>
								<p className="text-sm text-[#1E7A4C] mt-2 flex items-center gap-1">
									<TrendingUp className="h-4 w-4" />
									+12.5% от предыдущего периода
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
								<DollarSign className="h-6 w-6 text-accent" />
							</div>
						</div>
					</Card>

					{/* Average Utilization Card */}
					<Card className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Средняя загрузка
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									78.6%
								</p>
								<p className="text-sm text-[#1E7A4C] mt-2 flex items-center gap-1">
									<TrendingUp className="h-4 w-4" />
									+3.2% от предыдущего периода
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<BarChart3 className="h-6 w-6 text-primary" />
							</div>
						</div>
					</Card>

					{/* Bookings Card */}
					<Card className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Количество бронирований
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									342
								</p>
								<p className="text-sm text-[#1E7A4C] mt-2 flex items-center gap-1">
									<TrendingUp className="h-4 w-4" />
									+8.7% от предыдущего периода
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Calendar className="h-6 w-6 text-primary" />
							</div>
						</div>
					</Card>
				</div>

				{/* Revenue Chart */}
				<Card className="p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-lg font-semibold text-primary">
								График дохода
							</h3>
							<p className="text-sm text-muted-foreground mt-1">
								Динамика дохода по периодам
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								variant={
									chartView === 'month'
										? 'default'
										: 'outline'
								}
								size="sm"
								onClick={() => setChartView('month')}
								className={
									chartView === 'month'
										? 'bg-accent text-accent-foreground hover:bg-accent/90'
										: ''
								}
							>
								По месяцам
							</Button>
							<Button
								variant={
									chartView === 'week' ? 'default' : 'outline'
								}
								size="sm"
								onClick={() => setChartView('week')}
								className={
									chartView === 'week'
										? 'bg-accent text-accent-foreground hover:bg-accent/90'
										: ''
								}
							>
								По неделям
							</Button>
						</div>
					</div>

					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={revenueByMonth}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#E6E6E6"
								/>
								<XAxis
									dataKey="month"
									stroke="#6E7C73"
									fontSize={12}
								/>
								<YAxis
									stroke="#6E7C73"
									fontSize={12}
									tickFormatter={(value) =>
										`${value / 1000}k`
									}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#FFFFFF',
										border: '1px solid #E6E6E6',
										borderRadius: '8px',
										boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
									}}
									formatter={(value: any) => [
										`${value.toLocaleString('ru-RU')} ₽`,
										'Доход',
									]}
								/>
								<Bar
									dataKey="revenue"
									fill="#1E7A4C"
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>

				{/* Court Utilization */}
				<Card className="p-6">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-primary">
							Загруженность по кортам
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							Процент занятости каждого корта
						</p>
					</div>

					<div className="space-y-4">
						{courtUtilization.map((court) => (
							<div key={court.court} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">
										{court.court}
									</span>
									<span className="text-sm font-bold text-primary">
										{court.utilization}%
									</span>
								</div>
								<div className="h-3 bg-secondary rounded-full overflow-hidden">
									<div
										className="h-full bg-[#1E7A4C] rounded-full transition-all duration-500"
										style={{
											width: `${court.utilization}%`,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</AdminLayout>
	);
}
