'use client';

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import {
  Swords,
  Users,
  Clock,
  Trophy,
  Crown,
  Zap,
  Timer,
  Send,
  Eye,
  Plus,
  RotateCcw,
} from "lucide-react";

export function InterviewBattle() {
  const [selectedRoom, setSelectedRoom] = useState<
    string | null
  >(null);
  const [battlePhase, setBattlePhase] = useState<
    "lobby" | "waiting" | "battle" | "result"
  >("lobby");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  const activeRooms = [
    {
      id: "1",
      name: "초급자 배틀",
      host: "민수님",
      difficulty: "초급",
      players: 1,
      maxPlayers: 2,
      category: "프론트엔드",
      status: "waiting",
    },
    {
      id: "2",
      name: "React 마스터",
      host: "지영님",
      difficulty: "중급",
      players: 1,
      maxPlayers: 2,
      category: "React",
      status: "waiting",
    },
    {
      id: "3",
      name: "고수들의 대결",
      host: "현우님",
      difficulty: "고급",
      players: 2,
      maxPlayers: 2,
      category: "전체",
      status: "in-progress",
    },
  ];

  const currentQuestion = {
    id: 1,
    question:
      "React Hook의 개념과 useState의 동작 원리에 대해 설명해주세요.",
    category: "React",
    difficulty: "중급",
    timeLimit: 180,
  };

  const battleResult = {
    winner: "me",
    myScore: 85,
    opponentScore: 72,
    pointsEarned: 15,
    newRank: "Gold III",
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "초급":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "중급":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "고급":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (battlePhase === "battle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Animated chess pattern background */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="w-full h-full animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.08) 25%, rgba(59,130,246,0.08) 50%, transparent 50%, transparent 75%, rgba(59,130,246,0.08) 75%),
                linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.08) 25%, rgba(59,130,246,0.08) 50%, transparent 50%, transparent 75%, rgba(59,130,246,0.08) 75%)
              `,
              backgroundSize: "80px 80px",
              backgroundPosition: "0 0, 40px 40px",
            }}
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Epic Battle Header */}
            <div className="mb-8 text-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-spin-slow flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">♞</span>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full animate-spin-slow-reverse flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">♞</span>
                </div>
                <Card className="bg-white border border-blue-200 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-3xl">
                            ♔
                          </span>
                        </div>
                        <div>
                          <h1 className="text-4xl font-bold text-slate-800 mb-2">
                            체스 듀얼
                          </h1>
                          <div className="flex items-center space-x-4">
                            <p className="text-blue-600 text-lg">
                              당신
                            </p>
                            <span className="text-slate-600 text-2xl">
                              ⚔️
                            </span>
                            <p className="text-purple-600 text-lg">
                              vs 지영님
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Epic Timer */}
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-blue-200 flex items-center justify-center bg-white shadow-inner">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-blue-600 mb-1">
                                {formatTime(timeLeft)}
                              </div>
                              <p className="text-xs text-blue-500">
                                사고 시간
                              </p>
                            </div>
                          </div>
                          <div
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              background: `conic-gradient(from 0deg, #3b82f6 ${((180 - timeLeft) / 180) * 360}deg, transparent ${((180 - timeLeft) / 180) * 360}deg)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Battle Status */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="bg-white border border-emerald-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">♛</div>
                  <div className="text-emerald-600 font-bold">
                    라운드 1/3
                  </div>
                  <div className="text-emerald-500 text-sm">
                    현재 수
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-purple-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-purple-600 font-bold">
                    전략 모드
                  </div>
                  <div className="text-purple-500 text-sm">
                    집중력 최대화
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-amber-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-amber-600 font-bold">
                    {Math.round(((180 - timeLeft) / 180) * 100)}
                    %
                  </div>
                  <div className="text-amber-500 text-sm">
                    진행률
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Question */}
            <Card className="mb-8 bg-white border border-blue-200 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">
                        ♗
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-800">
                        전략적 도전
                      </CardTitle>
                      <p className="text-slate-600">
                        당신의 지식을 시험하는 순간
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Badge
                      className={getDifficultyColor(
                        currentQuestion.difficulty,
                      )}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {currentQuestion.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-100 mb-6">
                  <p className="text-xl leading-relaxed text-slate-800 font-medium">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Progress visualization */}
                <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                    style={{
                      width: `${((180 - timeLeft) / 180) * 100}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
                </div>
              </CardContent>
            </Card>

            {/* Master Answer Input */}
            <Card className="bg-white border border-blue-200 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">
                      ♕
                    </span>
                  </div>
                  <span className="text-xl">마스터의 응답</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="당신의 전략적 사고를 펼쳐보세요... 구체적인 예시와 논리적 근거를 제시하면 더욱 강력합니다."
                    className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-500 text-lg"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                    {answer.length}/1000
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        시간이 곧 전략입니다
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50"
                      onClick={() => setBattlePhase("lobby")}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      항복
                    </Button>
                    <Button
                      onClick={() => setBattlePhase("result")}
                      disabled={!answer.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 px-8 py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="mr-2">♚</span>
                      결정적 수 두기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (battlePhase === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Victory/Defeat atmosphere */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`w-full h-full ${battleResult.winner === "me" ? "animate-pulse" : ""}`}
            style={{
              background:
                battleResult.winner === "me"
                  ? "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle at center, rgba(156,163,175,0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Floating particles */}
        {battleResult.winner === "me" && (
          <>
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-40 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-60 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
          </>
        )}

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="mb-8 bg-white border border-blue-200 shadow-2xl">
              <CardContent className="p-12">
                {/* Epic Victory/Defeat Symbol */}
                <div className="relative mb-8">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
                      battleResult.winner === "me"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"
                        : "bg-gradient-to-br from-slate-500 to-slate-700"
                    }`}
                  >
                    {battleResult.winner === "me" ? (
                      <span className="text-white text-6xl">
                        ♔
                      </span>
                    ) : (
                      <span className="text-white text-6xl">
                        ♛
                      </span>
                    )}
                  </div>

                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 rounded-full blur-xl ${
                      battleResult.winner === "me"
                        ? "bg-blue-500/30 animate-pulse"
                        : "bg-slate-500/20"
                    }`}
                  ></div>
                </div>

                <h1
                  className={`text-6xl font-bold mb-4 ${
                    battleResult.winner === "me"
                      ? "text-blue-600"
                      : "text-slate-600"
                  }`}
                >
                  {battleResult.winner === "me"
                    ? "체크메이트!"
                    : "선전했습니다"}
                </h1>

                <p
                  className={`text-xl mb-8 ${
                    battleResult.winner === "me"
                      ? "text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  {battleResult.winner === "me"
                    ? "완벽한 전략으로 상대를 제압했습니다!"
                    : "더 나은 전략으로 다시 도전하세요."}
                </p>

                {/* Battle Score Visualization */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <Card className="bg-white border border-blue-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">
                          ♔
                        </span>
                      </div>
                      <p className="text-blue-600 mb-2">
                        당신의 점수
                      </p>
                      <p className="text-4xl font-bold text-blue-700">
                        {battleResult.myScore}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-purple-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">
                          ♚
                        </span>
                      </div>
                      <p className="text-purple-600 mb-2">
                        지영님의 점수
                      </p>
                      <p className="text-4xl font-bold text-purple-700">
                        {battleResult.opponentScore}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Rewards & Rankings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white border border-emerald-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-emerald-600 text-2xl">
                          ⚡
                        </span>
                        <span className="text-emerald-600">
                          ELO 포인트
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-emerald-700">
                        +{battleResult.pointsEarned}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-amber-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-amber-600 text-2xl">
                          🏆
                        </span>
                        <span className="text-amber-600">
                          새로운 랭크
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-amber-700">
                        {battleResult.newRank}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                  <Button
                    onClick={() => setBattlePhase("lobby")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 px-8 py-3 text-lg shadow-lg"
                  >
                    <span className="mr-2">♞</span>
                    다른 게임 찾기
                  </Button>

                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-8 py-3 text-lg"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    전투 분석 보기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Unlocked */}
            {battleResult.winner === "me" && (
              <Card className="bg-white border border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-3xl animate-bounce">
                      🏆
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        업적 달성!
                      </h3>
                      <p className="text-blue-600">
                        "전략적 승리" - 논리적 답변으로 승리를
                        달성했습니다
                      </p>
                    </div>
                    <span className="text-3xl animate-bounce delay-200">
                      ⭐
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Chess Battle Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♞</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              체스 듀얼
            </h1>
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♞</span>
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            전략적 사고로 상대를 제압하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Chess Game */}
          <Card className="lg:col-span-1 bg-white border border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <span className="text-blue-500">♚</span>
                <span>새 게임 생성</span>
              </CardTitle>
              <CardDescription className="text-slate-600">
                체스 듀얼을 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="게임 제목"
                className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500"
              />
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800">
                <option className="bg-white">레벨 선택</option>
                <option className="bg-white">
                  ♙ 폰 (초급)
                </option>
                <option className="bg-white">
                  ♗ 비숍 (중급)
                </option>
                <option className="bg-white">
                  ♕ 퀸 (고급)
                </option>
              </select>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800">
                <option className="bg-white">전문 분야</option>
                <option className="bg-white">프론트엔드</option>
                <option className="bg-white">백엔드</option>
                <option className="bg-white">React</option>
                <option className="bg-white">전체</option>
              </select>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg">
                <span className="mr-2">♔</span>
                게임 생성
              </Button>
            </CardContent>
          </Card>

          {/* Active Chess Games */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <span className="text-blue-500">♛</span>
                  <span>활성 체스 보드</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {
                      activeRooms.filter(
                        (r) => r.status === "waiting",
                      ).length
                    }
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  진행 중인 전략적 대결들
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeRooms.map((room, index) => {
                    const chessPieces = ["♜", "♞", "♝"];
                    return (
                      <div
                        key={room.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedRoom === room.id
                            ? "border-blue-300 bg-blue-50 shadow-lg"
                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                        } ${room.status === "in-progress" ? "opacity-60" : ""}`}
                        onClick={() =>
                          room.status !== "in-progress" &&
                          setSelectedRoom(room.id)
                        }
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg">
                                {chessPieces[index]}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-800">
                              {room.name}
                            </h3>
                          </div>
                          <div className="flex space-x-2">
                            <Badge
                              className={getDifficultyColor(
                                room.difficulty,
                              )}
                            >
                              {room.difficulty}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                              {room.category}
                            </Badge>
                            {room.status === "in-progress" && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                <Timer className="w-3 h-3 mr-1" />
                                진행중
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>마스터: {room.host}</span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {room.players}/{room.maxPlayers}
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedRoom && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setBattlePhase("battle")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg"
                      >
                        <span className="mr-2">♞</span>
                        게임 참가
                      </Button>
                      <Button
                        className="border-slate-300 text-slate-600 hover:bg-slate-50"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        관전하기
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chess Statistics */}
            <Card className="mt-6 bg-white border border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <span className="text-blue-500">♔</span>
                  <span>체스 마스터 기록</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="text-2xl mb-2 text-emerald-600">
                      ⚡
                    </div>
                    <p className="text-lg font-bold text-emerald-700">
                      23
                    </p>
                    <p className="text-xs text-emerald-600">
                      총 승리
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-2xl mb-2 text-amber-600">
                      📊
                    </div>
                    <p className="text-lg font-bold text-amber-700">
                      67%
                    </p>
                    <p className="text-xs text-amber-600">
                      승률
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-2xl mb-2 text-purple-600">
                      🏆
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      2,187
                    </p>
                    <p className="text-xs text-purple-600">
                      ELO 점수
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}